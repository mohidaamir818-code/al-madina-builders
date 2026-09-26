import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const STORE_PATH = path.join(process.cwd(), "data", "deal-subscribers.store.json");

export type DealSubscriber = {
  id: string;
  email: string;
  whatsapp: string;
  createdAt: string;
};

export type DealSubscriberInput = {
  email: string;
  whatsapp: string;
};

type DbRow = {
  id: string;
  email: string;
  whatsapp: string;
  created_at: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeWhatsapp(raw: string) {
  return raw.replace(/[\s-]/g, "").trim();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX */
export function isValidWhatsapp(phone: string) {
  return /^(\+92|0)?3\d{9}$/.test(normalizeWhatsapp(phone));
}

function normalize(raw: Partial<DealSubscriber> & { id: string }): DealSubscriber {
  return {
    id: raw.id,
    email: normalizeEmail(raw.email || ""),
    whatsapp: normalizeWhatsapp(raw.whatsapp || ""),
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

function fromDb(row: DbRow): DealSubscriber {
  return normalize({
    id: row.id,
    email: row.email,
    whatsapp: row.whatsapp,
    createdAt: row.created_at,
  });
}

function toDb(item: DealSubscriber) {
  return {
    id: item.id,
    email: item.email,
    whatsapp: item.whatsapp,
    created_at: item.createdAt,
  };
}

async function readFileStore(): Promise<DealSubscriber[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DealSubscriber>[];
    if (Array.isArray(parsed)) {
      return parsed.map((item, i) => normalize({ ...item, id: item.id || `sub-${i}` }));
    }
  } catch {
    /* empty */
  }
  return [];
}

async function writeFileStore(items: DealSubscriber[]) {
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listDealSubscribers(): Promise<DealSubscriber[]> {
  if (!isSupabaseConfigured()) return readFileStore();
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("deal_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[dealAlertStore] Supabase read failed, using file store:", error.message);
      return readFileStore();
    }
    return (data as DbRow[]).map(fromDb);
  } catch (err) {
    console.warn("[dealAlertStore] Supabase unavailable, using file store:", err);
    return readFileStore();
  }
}

export async function createDealSubscriber(
  input: DealSubscriberInput,
): Promise<{ subscriber: DealSubscriber; alreadyRegistered: boolean }> {
  const email = normalizeEmail(input.email);
  const whatsapp = normalizeWhatsapp(input.whatsapp);

  if (!isValidEmail(email)) throw new Error("Please enter a valid email address.");
  if (!isValidWhatsapp(whatsapp)) throw new Error("Enter a valid Pakistani WhatsApp number.");
  if (email.length > 120) throw new Error("Email is too long.");

  const all = await listDealSubscribers();
  const existing = all.find((s) => s.email === email);
  if (existing) {
    if (existing.whatsapp === whatsapp) {
      return { subscriber: existing, alreadyRegistered: true };
    }
    const updated: DealSubscriber = { ...existing, whatsapp };
    if (!isSupabaseConfigured()) {
      const items = await readFileStore();
      const idx = items.findIndex((s) => s.id === existing.id);
      if (idx >= 0) items[idx] = updated;
      await writeFileStore(items);
      return { subscriber: updated, alreadyRegistered: true };
    }
    try {
      const sb = getSupabaseAdmin();
      const { data, error } = await sb
        .from("deal_subscribers")
        .update({ whatsapp })
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw error;
      return { subscriber: fromDb(data as DbRow), alreadyRegistered: true };
    } catch (err) {
      console.warn("[dealAlertStore] Supabase update failed, using file store:", err);
      const items = await readFileStore();
      const idx = items.findIndex((s) => s.email === email);
      if (idx >= 0) items[idx] = updated;
      else items.unshift(updated);
      await writeFileStore(items);
      return { subscriber: updated, alreadyRegistered: true };
    }
  }

  const item: DealSubscriber = {
    id: `sub-${Date.now()}`,
    email,
    whatsapp,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return { subscriber: item, alreadyRegistered: false };
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("deal_subscribers").insert(toDb(item)).select("*").single();
    if (error) {
      console.warn("[dealAlertStore] Supabase insert failed, using file store:", error.message);
      const items = await readFileStore();
      items.unshift(item);
      await writeFileStore(items);
      return { subscriber: item, alreadyRegistered: false };
    }
    return { subscriber: fromDb(data as DbRow), alreadyRegistered: false };
  } catch (err) {
    console.warn("[dealAlertStore] Supabase insert error, using file store:", err);
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return { subscriber: item, alreadyRegistered: false };
  }
}

export async function deleteDealSubscriber(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const next = items.filter((s) => s.id !== id);
    if (next.length === items.length) return false;
    await writeFileStore(next);
    return true;
  }

  try {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("deal_subscribers").delete().eq("id", id);
    if (error) {
      console.warn("[dealAlertStore] Supabase delete failed, using file store:", error.message);
      const items = await readFileStore();
      await writeFileStore(items.filter((s) => s.id !== id));
      return true;
    }
    return true;
  } catch {
    const items = await readFileStore();
    await writeFileStore(items.filter((s) => s.id !== id));
    return true;
  }
}
