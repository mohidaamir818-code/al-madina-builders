import { promises as fs } from "fs";
import path from "path";
import {
  type AdminProperty,
  type AdminPropertyStatus,
  type BuildStatus,
  type SaleRent,
} from "@/data/adminProperties";
import { titleToSlug, uniqueSlug } from "@/lib/slug";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const STORE_PATH = path.join(process.cwd(), "data", "admin-properties.store.json");

type DbRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sale_rent: string;
  build_status: string;
  is_draft: boolean;
  property_type: string;
  price: string;
  price_number: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  tv_lounge: string;
  car_parking: string;
  facing: string;
  total_floors: string;
  condition: string;
  society: string;
  address: string;
  location: string;
  maps_link: string;
  lat: number | null;
  lng: number | null;
  images: string[] | unknown;
  videos: string[] | unknown;
  additional_info: string;
  beds: number;
  baths: number;
  area: string;
  price_display: string;
  image: string;
  status: string;
  public_slug: string | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
};

function displayStatus(saleRent: SaleRent, buildStatus: BuildStatus): AdminPropertyStatus {
  if (buildStatus === "In Progress" || buildStatus === "Grey Structure" || buildStatus === "On Hold") {
    return buildStatus === "Grey Structure" || buildStatus === "On Hold" ? buildStatus : "In Progress";
  }
  if (saleRent === "For Rent") return "For Rent";
  if (buildStatus === "Completed") return "Completed";
  return "For Sale";
}

function formatPrice(priceNumber: string, saleRent: SaleRent) {
  const digits = priceNumber.replace(/\D/g, "");
  if (!digits) return "PKR 0";
  const simple = Number(digits).toLocaleString("en-IN");
  return saleRent === "For Rent" ? `PKR ${simple} / Month` : `PKR ${simple}`;
}

function normalize(raw: Partial<AdminProperty> & { id: string }): AdminProperty {
  const saleRent = (raw.saleRent ||
    (raw.status === "For Rent" ? "For Rent" : "For Sale")) as SaleRent;
  const buildStatus = (raw.buildStatus ||
    (raw.status === "In Progress"
      ? "In Progress"
      : raw.status === "Completed"
        ? "Completed"
        : "Completed")) as BuildStatus;
  const images =
    raw.images?.length ? raw.images : raw.image ? [raw.image] : ["/images/listing-house-dusk.jpg"];
  const videos = raw.videos?.length ? raw.videos : [];
  const priceNumber = raw.priceNumber || (raw.price || "").replace(/\D/g, "") || "0";
  const title = raw.title || "Untitled Property";
  const location = raw.location || raw.address || raw.society || "";
  const slug = raw.slug || titleToSlug(title, location) || raw.id;

  return {
    id: raw.id,
    slug,
    title,
    description: raw.description || "",
    saleRent,
    buildStatus,
    isDraft: Boolean(raw.isDraft),
    propertyType: raw.propertyType || "House",
    price: raw.price || formatPrice(priceNumber, saleRent),
    priceNumber,
    size: raw.size || raw.area || "",
    bedrooms: raw.bedrooms ?? String(raw.beds ?? 0),
    bathrooms: raw.bathrooms ?? String(raw.baths ?? 0),
    kitchens: raw.kitchens || "1",
    tvLounge: raw.tvLounge || "1",
    carParking: raw.carParking || "1",
    facing: raw.facing || "South",
    totalFloors: raw.totalFloors || "2",
    condition: raw.condition || "New",
    society: raw.society || location.split(",")[0]?.trim() || "",
    address: raw.address || location,
    location: location || raw.address || "",
    mapsLink: raw.mapsLink || "",
    lat: raw.lat ?? null,
    lng: raw.lng ?? null,
    images,
    videos,
    additionalInfo: raw.additionalInfo || "",
    beds: Number(raw.beds ?? raw.bedrooms ?? 0) || 0,
    baths: Number(raw.baths ?? raw.bathrooms ?? 0) || 0,
    area: raw.area || raw.size || "",
    priceDisplay: raw.priceDisplay || raw.price || formatPrice(priceNumber, saleRent),
    image: images[0] || "/images/listing-house-dusk.jpg",
    status: raw.status || displayStatus(saleRent, buildStatus),
    publicSlug: raw.publicSlug,
    isFeatured: Boolean(raw.isFeatured),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function fromDb(row: DbRow): AdminProperty {
  const images = Array.isArray(row.images) ? (row.images as string[]) : [];
  const videos = Array.isArray(row.videos) ? (row.videos as string[]) : [];
  return normalize({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    saleRent: row.sale_rent as SaleRent,
    buildStatus: row.build_status as BuildStatus,
    isDraft: row.is_draft,
    propertyType: row.property_type,
    price: row.price,
    priceNumber: row.price_number,
    size: row.size,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    kitchens: row.kitchens,
    tvLounge: row.tv_lounge,
    carParking: row.car_parking,
    facing: row.facing,
    totalFloors: row.total_floors,
    condition: row.condition,
    society: row.society,
    address: row.address,
    location: row.location,
    mapsLink: row.maps_link,
    lat: row.lat,
    lng: row.lng,
    images,
    videos,
    additionalInfo: row.additional_info,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    priceDisplay: row.price_display,
    image: row.image,
    status: row.status as AdminPropertyStatus,
    publicSlug: row.public_slug || undefined,
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toDb(property: AdminProperty): DbRow {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    sale_rent: property.saleRent,
    build_status: property.buildStatus,
    is_draft: property.isDraft,
    property_type: property.propertyType,
    price: property.price,
    price_number: property.priceNumber,
    size: property.size,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    kitchens: property.kitchens,
    tv_lounge: property.tvLounge,
    car_parking: property.carParking,
    facing: property.facing,
    total_floors: property.totalFloors,
    condition: property.condition,
    society: property.society,
    address: property.address,
    location: property.location,
    maps_link: property.mapsLink || "",
    lat: property.lat,
    lng: property.lng,
    images: property.images,
    videos: property.videos,
    additional_info: property.additionalInfo || "",
    beds: property.beds,
    baths: property.baths,
    area: property.area,
    price_display: property.priceDisplay,
    image: property.image,
    status: property.status,
    public_slug: property.publicSlug || null,
    is_featured: property.isFeatured,
    created_at: property.createdAt,
    updated_at: property.updatedAt,
  };
}

async function readFileStore(): Promise<AdminProperty[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminProperty>[];
    if (Array.isArray(parsed)) {
      return parsed.map((item, i) => normalize({ ...item, id: item.id || `adm-${i}` }));
    }
  } catch {
    /* empty */
  }
  return [];
}

async function writeFileStore(items: AdminProperty[]) {
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export type AdminPropertyFormInput = {
  title: string;
  description: string;
  saleRent: SaleRent;
  buildStatus: BuildStatus;
  isDraft?: boolean;
  propertyType: string;
  priceNumber: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  tvLounge: string;
  carParking: string;
  facing: string;
  totalFloors: string;
  condition: string;
  society: string;
  address: string;
  mapsLink?: string;
  lat?: number | null;
  lng?: number | null;
  images?: string[];
  videos?: string[];
  additionalInfo?: string;
  publicSlug?: string;
  isFeatured?: boolean;
};

function buildFromInput(input: AdminPropertyFormInput, prev?: AdminProperty): Omit<AdminProperty, "id" | "createdAt"> {
  const saleRent = input.saleRent;
  const buildStatus = input.buildStatus;
  const priceNumber = String(input.priceNumber || "").replace(/\D/g, "");
  const price = formatPrice(priceNumber, saleRent);
  const location = [input.society, input.address].filter(Boolean).join(", ") || input.address || input.society;
  const images =
    input.images?.length ? input.images : prev?.images?.length ? prev.images : ["/images/listing-house-dusk.jpg"];
  const videos = input.videos !== undefined ? input.videos : prev?.videos || [];

  return {
    slug: prev?.slug || "",
    title: input.title.trim(),
    description: input.description.trim(),
    saleRent,
    buildStatus,
    isDraft: Boolean(input.isDraft),
    propertyType: input.propertyType.trim(),
    price,
    priceNumber,
    size: input.size.trim(),
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    kitchens: input.kitchens,
    tvLounge: input.tvLounge,
    carParking: input.carParking,
    facing: input.facing,
    totalFloors: input.totalFloors,
    condition: input.condition,
    society: input.society.trim(),
    address: input.address.trim(),
    mapsLink: (input.mapsLink || "").trim(),
    location,
    lat: input.lat ?? prev?.lat ?? null,
    lng: input.lng ?? prev?.lng ?? null,
    images,
    videos,
    additionalInfo: (input.additionalInfo || "").trim(),
    beds: Number.parseInt(input.bedrooms, 10) || 0,
    baths: Number.parseInt(input.bathrooms, 10) || 0,
    area: input.size.trim(),
    priceDisplay: price,
    image: images[0],
    status: displayStatus(saleRent, buildStatus),
    publicSlug: input.publicSlug?.trim() || prev?.publicSlug,
    isFeatured: input.isFeatured !== undefined ? Boolean(input.isFeatured) : Boolean(prev?.isFeatured),
    updatedAt: new Date().toISOString(),
  };
}

export async function listAdminProperties() {
  if (!isSupabaseConfigured()) return readFileStore();
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("properties").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbRow[]).map(fromDb);
}

export async function getAdminProperty(id: string) {
  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    return items.find((p) => p.id === id) ?? null;
  }
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? fromDb(data as DbRow) : null;
}

export async function getAdminPropertyBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    return items.find((p) => p.slug === slug || p.publicSlug === slug || p.id === slug) ?? null;
  }
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("properties")
    .select("*")
    .or(`slug.eq.${slug},public_slug.eq.${slug},id.eq.${slug}`)
    .maybeSingle();
  if (error) throw error;
  return data ? fromDb(data as DbRow) : null;
}

export async function createAdminProperty(input: AdminPropertyFormInput) {
  const existing = await listAdminProperties();
  const now = new Date().toISOString();
  const used = new Set(existing.map((p) => p.slug));
  const base = buildFromInput(input);
  const slug = uniqueSlug(titleToSlug(base.title, base.society || base.location), used);
  const property: AdminProperty = {
    id: `adm-${Date.now()}`,
    ...base,
    slug,
    createdAt: now,
  };

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    items.unshift(property);
    await writeFileStore(items);
    return property;
  }

  const sb = getSupabaseAdmin();
  const row = toDb(property);
  const { data, error } = await sb.from("properties").insert(row).select("*").single();
  if (error) {
    // Older DBs may miss optional columns — strip and retry
    let payload: Record<string, unknown> = { ...row };
    if (/videos/i.test(error.message)) {
      const { videos: _v, ...rest } = payload;
      payload = rest;
    }
    if (/is_featured/i.test(error.message)) {
      const { is_featured: _f, ...rest } = payload;
      payload = rest;
    }
    if (payload !== row && Object.keys(payload).length) {
      const retry = await sb.from("properties").insert(payload).select("*").single();
      if (retry.error) {
        let payload2 = { ...payload };
        if (/videos/i.test(retry.error.message)) {
          const { videos: _v, ...rest } = payload2;
          payload2 = rest;
        }
        if (/is_featured/i.test(retry.error.message)) {
          const { is_featured: _f, ...rest } = payload2;
          payload2 = rest;
        }
        const retry2 = await sb.from("properties").insert(payload2).select("*").single();
        if (retry2.error) throw new Error(retry2.error.message);
        return fromDb(retry2.data as DbRow);
      }
      return fromDb(retry.data as DbRow);
    }
    throw new Error(error.message);
  }
  return fromDb(data as DbRow);
}

export async function updateAdminProperty(id: string, input: AdminPropertyFormInput) {
  const prev = await getAdminProperty(id);
  if (!prev) return null;
  const updated: AdminProperty = {
    ...prev,
    ...buildFromInput(input, prev),
    id: prev.id,
    slug: prev.slug,
    createdAt: prev.createdAt,
  };

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const index = items.findIndex((p) => p.id === id);
    if (index < 0) return null;
    items[index] = updated;
    await writeFileStore(items);
    return updated;
  }

  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("properties").update(toDb(updated)).eq("id", id).select("*").single();
  if (error) throw error;
  return fromDb(data as DbRow);
}

export async function updateAdminPropertyBySlug(slug: string, input: AdminPropertyFormInput) {
  const found = await getAdminPropertyBySlug(slug);
  if (!found) return null;
  return updateAdminProperty(found.id, input);
}

export async function deleteAdminProperty(id: string) {
  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const next = items.filter((p) => p.id !== id);
    if (next.length === items.length) return false;
    await writeFileStore(next);
    return true;
  }
  const sb = getSupabaseAdmin();
  const { error, count } = await sb.from("properties").delete({ count: "exact" }).eq("id", id);
  if (error) throw error;
  return (count || 0) > 0;
}

export async function countByStatus() {
  const items = await listAdminProperties();
  const counts: Record<"All" | "For Sale" | "For Rent" | "In Progress" | "Completed", number> = {
    All: items.filter((p) => !p.isDraft).length,
    "For Sale": 0,
    "For Rent": 0,
    "In Progress": 0,
    Completed: 0,
  };
  for (const item of items) {
    if (item.isDraft) continue;
    if (item.saleRent === "For Sale") counts["For Sale"] += 1;
    if (item.saleRent === "For Rent") counts["For Rent"] += 1;
    if (
      item.buildStatus === "In Progress" ||
      item.buildStatus === "Grey Structure" ||
      item.buildStatus === "On Hold"
    ) {
      counts["In Progress"] += 1;
    }
    if (item.buildStatus === "Completed") counts.Completed += 1;
  }
  return counts;
}
