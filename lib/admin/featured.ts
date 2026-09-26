import { listAdminProperties } from "@/lib/admin/propertyStore";
import { listAdminHouseMaps } from "@/lib/admin/houseMapStore";

export const MAX_FEATURED = 20;

/** Count currently featured house + map listings (excluding optional id when editing). */
export async function countFeaturedListings(excludeId?: string) {
  const [properties, maps] = await Promise.all([listAdminProperties(), listAdminHouseMaps()]);
  const featuredProps = properties.filter((p) => p.isFeatured && !p.isDraft && p.id !== excludeId);
  const featuredMaps = maps.filter((m) => m.isFeatured && !m.isDraft && m.id !== excludeId);
  return featuredProps.length + featuredMaps.length;
}

export async function canMarkFeatured(excludeId?: string) {
  const count = await countFeaturedListings(excludeId);
  return count < MAX_FEATURED;
}

/** Throws if marking featured would exceed the limit. */
export async function assertCanMarkFeatured(wantFeatured: boolean, excludeId?: string) {
  if (!wantFeatured) return;
  const ok = await canMarkFeatured(excludeId);
  if (!ok) {
    throw new Error(`Featured limit reached — max ${MAX_FEATURED} featured listings allowed.`);
  }
}
