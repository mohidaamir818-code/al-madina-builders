import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const STORE_PATH = path.join(process.cwd(), "data", "feedbacks.store.json");

export type Feedback = {
  id: string;
  name: string;
  text: string;
  rating: number;
  isPublished: boolean;
  createdAt: string;
};

export type FeedbackInput = {
  name: string;
  text: string;
  rating?: number;
};

type DbRow = {
  id: string;
  name: string;
  text: string;
  rating: number;
  is_published: boolean;
  created_at: string;
};

function normalize(raw: Partial<Feedback> & { id: string }): Feedback {
  const rating = Math.min(5, Math.max(1, Number(raw.rating) || 5));
  return {
    id: raw.id,
    name: (raw.name || "Anonymous").trim(),
    text: (raw.text || "").trim(),
    rating,
    isPublished: Boolean(raw.isPublished),
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

function fromDb(row: DbRow): Feedback {
  return normalize({
    id: row.id,
    name: row.name,
    text: row.text,
    rating: row.rating,
    isPublished: row.is_published,
    createdAt: row.created_at,
  });
}

function toDb(item: Feedback) {
  return {
    id: item.id,
    name: item.name,
    text: item.text,
    rating: item.rating,
    is_published: item.isPublished,
    created_at: item.createdAt,
  };
}

async function readFileStore(): Promise<Feedback[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Feedback>[];
    if (Array.isArray(parsed)) {
      return parsed.map((item, i) => normalize({ ...item, id: item.id || `fb-${i}` }));
    }
  } catch {
    /* empty */
  }
  return [];
}

async function writeFileStore(items: Feedback[]) {
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listFeedbacks() {
  if (!isSupabaseConfigured()) return readFileStore();
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("feedbacks").select("*").order("created_at", { ascending: false });
    if (error) {
      console.warn("[feedbackStore] Supabase read failed, using file store:", error.message);
      return readFileStore();
    }
    return (data as DbRow[]).map(fromDb);
  } catch (err) {
    console.warn("[feedbackStore] Supabase unavailable, using file store:", err);
    return readFileStore();
  }
}

export async function getPublishedFeedbacks(limit = 24): Promise<Feedback[]> {
  const all = await listFeedbacks();
  return all.filter((f) => f.isPublished && f.text).slice(0, limit);
}

export async function getPendingFeedbacks(): Promise<Feedback[]> {
  const all = await listFeedbacks();
  return all.filter((f) => !f.isPublished);
}

export async function setFeedbackPublished(id: string, isPublished: boolean): Promise<Feedback | null> {
  const all = await listFeedbacks();
  const found = all.find((f) => f.id === id);
  if (!found) return null;

  const updated: Feedback = { ...found, isPublished: Boolean(isPublished) };

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const idx = items.findIndex((f) => f.id === id);
    if (idx < 0) return null;
    items[idx] = updated;
    await writeFileStore(items);
    return updated;
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("feedbacks")
      .update({ is_published: updated.isPublished })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      console.warn("[feedbackStore] Supabase update failed, using file store:", error.message);
      const items = await readFileStore();
      const idx = items.findIndex((f) => f.id === id);
      if (idx < 0) {
        items.unshift(updated);
      } else {
        items[idx] = updated;
      }
      await writeFileStore(items);
      return updated;
    }
    return fromDb(data as DbRow);
  } catch (err) {
    console.warn("[feedbackStore] Supabase update error, using file store:", err);
    const items = await readFileStore();
    const idx = items.findIndex((f) => f.id === id);
    if (idx < 0) items.unshift(updated);
    else items[idx] = updated;
    await writeFileStore(items);
    return updated;
  }
}

export async function deleteFeedback(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const next = items.filter((f) => f.id !== id);
    if (next.length === items.length) return false;
    await writeFileStore(next);
    return true;
  }

  try {
    const sb = getSupabaseAdmin();
    const { error, count } = await sb.from("feedbacks").delete({ count: "exact" }).eq("id", id);
    if (error) {
      console.warn("[feedbackStore] Supabase delete failed, using file store:", error.message);
      const items = await readFileStore();
      const next = items.filter((f) => f.id !== id);
      await writeFileStore(next);
      return true;
    }
    return (count || 0) > 0;
  } catch {
    const items = await readFileStore();
    const next = items.filter((f) => f.id !== id);
    await writeFileStore(next);
    return true;
  }
}

export async function createFeedback(input: FeedbackInput) {
  const name = input.name.trim();
  const text = input.text.trim();
  if (!name || !text) throw new Error("Name and review are required.");
  if (name.length > 80) throw new Error("Name is too long.");
  if (text.length > 1000) throw new Error("Review is too long.");

  const item: Feedback = {
    id: `fb-${Date.now()}`,
    name,
    text,
    rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
    isPublished: false,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return item;
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("feedbacks").insert(toDb(item)).select("*").single();
    if (error) {
      console.warn("[feedbackStore] Supabase insert failed, using file store:", error.message);
      const items = await readFileStore();
      items.unshift(item);
      await writeFileStore(items);
      return item;
    }
    return fromDb(data as DbRow);
  } catch (err) {
    console.warn("[feedbackStore] Supabase insert error, using file store:", err);
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return item;
  }
}
