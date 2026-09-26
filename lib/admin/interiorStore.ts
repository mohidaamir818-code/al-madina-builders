import { promises as fs } from "fs";
import path from "path";
import { titleToSlug, uniqueSlug } from "@/lib/slug";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const STORE_PATH = path.join(process.cwd(), "data", "admin-interiors.store.json");

export type AdminInterior = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  price: string;
  priceNumber: string;
  rating: number;
  reviews: number;
  images: string[];
  image: string;
  features: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InteriorFormInput = {
  title: string;
  category: string;
  location: string;
  description: string;
  priceNumber: string;
  rating?: number;
  reviews?: number;
  images?: string[];
  features?: string[];
  isDraft?: boolean;
};

type DbRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  price: string;
  price_number: string;
  rating: number;
  reviews: number;
  images: string[] | unknown;
  image: string;
  features: string[] | unknown;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
};

function formatPrice(priceNumber: string) {
  const digits = priceNumber.replace(/\D/g, "");
  if (!digits || digits === "0") return "";
  return `PKR ${Number(digits).toLocaleString("en-IN")} (Design Package)`;
}

function normalize(raw: Partial<AdminInterior> & { id: string }): AdminInterior {
  const images = raw.images?.length ? raw.images : raw.image ? [raw.image] : ["/images/interior-living.jpg"];
  const priceNumber = raw.priceNumber || (raw.price || "").replace(/\D/g, "") || "0";
  return {
    id: raw.id,
    slug: raw.slug || titleToSlug(raw.title || "interior", raw.category || "") || raw.id,
    title: raw.title || "Untitled Design",
    category: raw.category || "Living Room",
    location: raw.location || "",
    description: raw.description || "",
    price: raw.price || formatPrice(priceNumber),
    priceNumber,
    rating: Number(raw.rating) || 4.8,
    reviews: Number(raw.reviews) || 0,
    images,
    image: images[0],
    features: raw.features || [],
    isDraft: Boolean(raw.isDraft),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function fromDb(row: DbRow): AdminInterior {
  return normalize({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location,
    description: row.description,
    price: row.price,
    priceNumber: row.price_number,
    rating: Number(row.rating),
    reviews: row.reviews,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    image: row.image,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    isDraft: row.is_draft,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toDb(item: AdminInterior) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    location: item.location,
    description: item.description,
    price: item.price,
    price_number: item.priceNumber,
    rating: item.rating,
    reviews: item.reviews,
    images: item.images,
    image: item.image,
    features: item.features,
    is_draft: item.isDraft,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

async function readFileStore(): Promise<AdminInterior[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminInterior>[];
    if (Array.isArray(parsed)) return parsed.map((item, i) => normalize({ ...item, id: item.id || `int-${i}` }));
  } catch {
    /* empty */
  }
  return [];
}

async function writeFileStore(items: AdminInterior[]) {
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listAdminInteriors() {
  if (!isSupabaseConfigured()) return readFileStore();
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("interior_designs").select("*").order("created_at", { ascending: false });
    if (error) {
      // Table not created yet — use local file store
      console.warn("[interiorStore] Supabase read failed, using file store:", error.message);
      return readFileStore();
    }
    return (data as DbRow[]).map(fromDb);
  } catch (err) {
    console.warn("[interiorStore] Supabase unavailable, using file store:", err);
    return readFileStore();
  }
}

export async function createAdminInterior(input: InteriorFormInput) {
  const existing = await listAdminInteriors();
  const used = new Set(existing.map((p) => p.slug));
  const now = new Date().toISOString();
  const priceNumber = String(input.priceNumber || "").replace(/\D/g, "");
  const images = input.images?.length ? input.images : ["/images/interior-living.jpg"];
  const item: AdminInterior = {
    id: `int-${Date.now()}`,
    slug: uniqueSlug(titleToSlug(input.title, input.category || "interior"), used),
    title: input.title.trim(),
    category: (input.category || "Living Room").trim(),
    location: (input.location || "").trim(),
    description: input.description.trim(),
    price: formatPrice(priceNumber),
    priceNumber: priceNumber || "0",
    rating: Number(input.rating) || 4.8,
    reviews: Number(input.reviews) || 0,
    images,
    image: images[0],
    features: (input.features || []).map((f) => f.trim()).filter(Boolean),
    isDraft: Boolean(input.isDraft),
    createdAt: now,
    updatedAt: now,
  };

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return item;
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("interior_designs").insert(toDb(item)).select("*").single();
    if (error) {
      console.warn("[interiorStore] Supabase insert failed, using file store:", error.message);
      const items = await readFileStore();
      items.unshift(item);
      await writeFileStore(items);
      return item;
    }
    return fromDb(data as DbRow);
  } catch (err) {
    console.warn("[interiorStore] Supabase insert error, using file store:", err);
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return item;
  }
}

export async function getPublishedInteriors() {
  const all = await listAdminInteriors();
  return all.filter((p) => !p.isDraft);
}

export async function getPublishedInteriorBySlug(slug: string) {
  const all = await getPublishedInteriors();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
}
