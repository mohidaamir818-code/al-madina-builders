import { promises as fs } from "fs";
import path from "path";
import { titleToSlug, uniqueSlug } from "@/lib/slug";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const STORE_PATH = path.join(process.cwd(), "data", "admin-house-maps.store.json");

export type AdminHouseMap = {
  id: string;
  slug: string;
  title: string;
  badge: string;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  floors: number;
  price: string;
  priceNumber: string;
  images: string[];
  image: string;
  features: string[];
  isDraft: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HouseMapFormInput = {
  title: string;
  badge: string;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  floors: number;
  priceNumber: string;
  images?: string[];
  features?: string[];
  isDraft?: boolean;
  isFeatured?: boolean;
};

type DbRow = {
  id: string;
  slug: string;
  title: string;
  badge: string;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  floors: number;
  price: string;
  price_number: string;
  images: string[] | unknown;
  image: string;
  features: string[] | unknown;
  is_draft: boolean;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
};

function formatPrice(priceNumber: string) {
  const digits = priceNumber.replace(/\D/g, "");
  if (!digits) return "PKR 0";
  return `PKR ${Number(digits).toLocaleString("en-IN")}`;
}

function normalize(raw: Partial<AdminHouseMap> & { id: string }): AdminHouseMap {
  const images = raw.images?.length ? raw.images : raw.image ? [raw.image] : ["/images/floorplan-5marla.jpg"];
  const priceNumber = raw.priceNumber || (raw.price || "").replace(/\D/g, "") || "0";
  return {
    id: raw.id,
    slug: raw.slug || titleToSlug(raw.title || "house-plan", raw.badge || "") || raw.id,
    title: raw.title || "Untitled Plan",
    badge: raw.badge || "",
    description: raw.description || "",
    beds: Number(raw.beds) || 0,
    baths: Number(raw.baths) || 0,
    sqft: Number(raw.sqft) || 0,
    floors: Number(raw.floors) || 1,
    price: raw.price || formatPrice(priceNumber),
    priceNumber,
    images,
    image: images[0],
    features: raw.features || [],
    isDraft: Boolean(raw.isDraft),
    isFeatured: Boolean(raw.isFeatured),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function fromDb(row: DbRow): AdminHouseMap {
  return normalize({
    id: row.id,
    slug: row.slug,
    title: row.title,
    badge: row.badge,
    description: row.description,
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    floors: row.floors,
    price: row.price,
    priceNumber: row.price_number,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    image: row.image,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    isDraft: row.is_draft,
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toDb(item: AdminHouseMap) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    badge: item.badge,
    description: item.description,
    beds: item.beds,
    baths: item.baths,
    sqft: item.sqft,
    floors: item.floors,
    price: item.price,
    price_number: item.priceNumber,
    images: item.images,
    image: item.image,
    features: item.features,
    is_draft: item.isDraft,
    is_featured: item.isFeatured,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

async function readFileStore(): Promise<AdminHouseMap[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminHouseMap>[];
    if (Array.isArray(parsed)) return parsed.map((item, i) => normalize({ ...item, id: item.id || `map-${i}` }));
  } catch {
    /* empty */
  }
  return [];
}

async function writeFileStore(items: AdminHouseMap[]) {
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listAdminHouseMaps() {
  if (!isSupabaseConfigured()) return readFileStore();
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("house_maps").select("*").order("created_at", { ascending: false });
    if (error) {
      console.warn("[houseMapStore] Supabase read failed, using file store:", error.message);
      return readFileStore();
    }
    return (data as DbRow[]).map(fromDb);
  } catch (err) {
    console.warn("[houseMapStore] Supabase unavailable, using file store:", err);
    return readFileStore();
  }
}

export async function createAdminHouseMap(input: HouseMapFormInput) {
  const existing = await listAdminHouseMaps();
  const used = new Set(existing.map((p) => p.slug));
  const now = new Date().toISOString();
  const priceNumber = String(input.priceNumber || "").replace(/\D/g, "");
  const images = input.images?.length ? input.images : ["/images/floorplan-5marla.jpg"];
  const item: AdminHouseMap = {
    id: `map-${Date.now()}`,
    slug: uniqueSlug(titleToSlug(input.title, input.badge || "map"), used),
    title: input.title.trim(),
    badge: (input.badge || "").trim(),
    description: input.description.trim(),
    beds: Number(input.beds) || 0,
    baths: Number(input.baths) || 0,
    sqft: Number(input.sqft) || 0,
    floors: Number(input.floors) || 1,
    price: priceNumber && priceNumber !== "0" ? formatPrice(priceNumber) : "",
    priceNumber: priceNumber || "0",
    images,
    image: images[0],
    features: (input.features || []).map((f) => f.trim()).filter(Boolean),
    isDraft: Boolean(input.isDraft),
    isFeatured: Boolean(input.isFeatured),
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
    const { data, error } = await sb.from("house_maps").insert(toDb(item)).select("*").single();
    if (error) {
      console.warn("[houseMapStore] Supabase insert failed, using file store:", error.message);
      const items = await readFileStore();
      items.unshift(item);
      await writeFileStore(items);
      return item;
    }
    return fromDb(data as DbRow);
  } catch (err) {
    console.warn("[houseMapStore] Supabase insert error, using file store:", err);
    const items = await readFileStore();
    items.unshift(item);
    await writeFileStore(items);
    return item;
  }
}

export async function getPublishedHouseMaps(): Promise<AdminHouseMap[]> {
  const all = await listAdminHouseMaps();
  return all.filter((p) => !p.isDraft);
}

export async function getPublishedHouseMapBySlug(slug: string) {
  const all = await getPublishedHouseMaps();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
}
