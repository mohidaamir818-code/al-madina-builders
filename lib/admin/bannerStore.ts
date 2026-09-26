import { promises as fs } from "fs";
import path from "path";
import {
  type BannerButton,
  type BannerButtonStyle,
  type BannerPageKey,
  getBannerPageMeta,
  isBannerPageKey,
} from "@/data/banners";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const STORE_PATH = path.join(process.cwd(), "data", "site-banners.store.json");

export type SiteBanner = {
  id: string;
  pageKey: BannerPageKey;
  title: string;
  subtitle: string;
  eyebrow: string;
  scriptText: string;
  imageUrl: string;
  mobileImageUrl: string;
  buttons: BannerButton[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SiteBannerInput = {
  pageKey: BannerPageKey;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  scriptText?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  buttons?: BannerButton[];
  isActive?: boolean;
};

type DbRow = {
  id: string;
  page_key: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  script_text: string;
  image_url: string;
  mobile_image_url?: string | null;
  buttons: BannerButton[] | unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function normalizeButton(raw: Partial<BannerButton>): BannerButton | null {
  const label = String(raw.label || "").trim();
  const href = String(raw.href || "").trim();
  if (!label || !href) return null;
  const style: BannerButtonStyle = raw.style === "outline" ? "outline" : "primary";
  return { label, href, style };
}

function normalizeButtons(raw: unknown): BannerButton[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeButton((item || {}) as Partial<BannerButton>))
    .filter((b): b is BannerButton => Boolean(b))
    .slice(0, 6);
}

function normalize(raw: Partial<SiteBanner> & { id: string; pageKey: BannerPageKey }): SiteBanner {
  const meta = getBannerPageMeta(raw.pageKey);
  return {
    id: raw.id,
    pageKey: raw.pageKey,
    title: (raw.title || "").trim(),
    subtitle: (raw.subtitle || "").trim(),
    eyebrow: (raw.eyebrow || "").trim(),
    scriptText: (raw.scriptText || "").trim(),
    imageUrl: (raw.imageUrl || meta?.defaultImage || "").trim(),
    mobileImageUrl: (raw.mobileImageUrl || "").trim(),
    buttons: normalizeButtons(raw.buttons),
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function fromDb(row: DbRow): SiteBanner | null {
  if (!isBannerPageKey(row.page_key)) return null;
  return normalize({
    id: row.id,
    pageKey: row.page_key,
    title: row.title,
    subtitle: row.subtitle,
    eyebrow: row.eyebrow,
    scriptText: row.script_text,
    imageUrl: row.image_url,
    mobileImageUrl: row.mobile_image_url || "",
    buttons: Array.isArray(row.buttons) ? (row.buttons as BannerButton[]) : [],
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toDb(item: SiteBanner) {
  return {
    id: item.id,
    page_key: item.pageKey,
    title: item.title,
    subtitle: item.subtitle,
    eyebrow: item.eyebrow,
    script_text: item.scriptText,
    image_url: item.imageUrl,
    mobile_image_url: item.mobileImageUrl,
    buttons: item.buttons,
    is_active: item.isActive,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

async function readFileStore(): Promise<SiteBanner[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteBanner>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Partial<SiteBanner> & { pageKey: BannerPageKey } =>
        Boolean(item?.pageKey && isBannerPageKey(String(item.pageKey))),
      )
      .map((item, i) =>
        normalize({
          ...item,
          id: item.id || `banner-${i}`,
          pageKey: item.pageKey,
        }),
      );
  } catch {
    return [];
  }
}

async function writeFileStore(items: SiteBanner[]) {
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listSiteBanners(): Promise<SiteBanner[]> {
  if (!isSupabaseConfigured()) return readFileStore();
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("site_banners").select("*").order("updated_at", { ascending: false });
    if (error) {
      console.warn("[bannerStore] Supabase read failed, using file store:", error.message);
      return readFileStore();
    }
    return (data as DbRow[]).map(fromDb).filter((b): b is SiteBanner => Boolean(b));
  } catch (err) {
    console.warn("[bannerStore] Supabase unavailable:", err);
    return readFileStore();
  }
}

export async function getBannerByPageKey(pageKey: BannerPageKey): Promise<SiteBanner | null> {
  const all = await listSiteBanners();
  return all.find((b) => b.pageKey === pageKey && b.isActive) ?? null;
}

export async function upsertSiteBanner(input: SiteBannerInput): Promise<SiteBanner> {
  if (!isBannerPageKey(input.pageKey)) {
    throw new Error("Invalid banner page.");
  }

  const existing = (await listSiteBanners()).find((b) => b.pageKey === input.pageKey);
  const now = new Date().toISOString();
  const meta = getBannerPageMeta(input.pageKey);

  const banner = normalize({
    id: existing?.id || `banner-${input.pageKey}-${Date.now()}`,
    pageKey: input.pageKey,
    title: input.title !== undefined ? input.title : existing?.title || "",
    subtitle: input.subtitle !== undefined ? input.subtitle : existing?.subtitle || "",
    eyebrow: input.eyebrow !== undefined ? input.eyebrow : existing?.eyebrow || "",
    scriptText: input.scriptText !== undefined ? input.scriptText : existing?.scriptText || "",
    imageUrl:
      input.imageUrl !== undefined
        ? input.imageUrl
        : existing?.imageUrl || meta?.defaultImage || "",
    mobileImageUrl:
      input.mobileImageUrl !== undefined
        ? input.mobileImageUrl
        : existing?.mobileImageUrl || "",
    buttons: input.buttons !== undefined ? input.buttons : existing?.buttons || [],
    isActive: input.isActive !== undefined ? input.isActive : existing?.isActive ?? true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  });

  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const idx = items.findIndex((b) => b.pageKey === banner.pageKey);
    if (idx >= 0) items[idx] = banner;
    else items.unshift(banner);
    await writeFileStore(items);
    return banner;
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("site_banners")
      .upsert(toDb(banner), { onConflict: "page_key" })
      .select("*")
      .single();
    if (error) {
      console.warn("[bannerStore] Supabase upsert failed, using file store:", error.message);
      const items = await readFileStore();
      const idx = items.findIndex((b) => b.pageKey === banner.pageKey);
      if (idx >= 0) items[idx] = banner;
      else items.unshift(banner);
      await writeFileStore(items);
      return banner;
    }
    return fromDb(data as DbRow) || banner;
  } catch (err) {
    console.warn("[bannerStore] Supabase upsert error, using file store:", err);
    const items = await readFileStore();
    const idx = items.findIndex((b) => b.pageKey === banner.pageKey);
    if (idx >= 0) items[idx] = banner;
    else items.unshift(banner);
    await writeFileStore(items);
    return banner;
  }
}

export async function deleteSiteBanner(pageKey: BannerPageKey): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const items = await readFileStore();
    const next = items.filter((b) => b.pageKey !== pageKey);
    if (next.length === items.length) return false;
    await writeFileStore(next);
    return true;
  }

  try {
    const sb = getSupabaseAdmin();
    const { error, count } = await sb
      .from("site_banners")
      .delete({ count: "exact" })
      .eq("page_key", pageKey);
    if (error) {
      console.warn("[bannerStore] Supabase delete failed:", error.message);
      const items = await readFileStore();
      const next = items.filter((b) => b.pageKey !== pageKey);
      await writeFileStore(next);
      return true;
    }
    return (count || 0) > 0;
  } catch {
    const items = await readFileStore();
    const next = items.filter((b) => b.pageKey !== pageKey);
    await writeFileStore(next);
    return true;
  }
}
