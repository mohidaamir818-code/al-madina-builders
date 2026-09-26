import { titleToSlug, uniqueSlug } from "@/lib/slug";

export type ListingBadge = "For Sale" | "For Rent" | "House Map";
export type ListingKind = "Residential" | "Commercial" | "Plot" | "Rental";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  badge: ListingBadge;
  location: string;
  area: string;
  beds?: number;
  baths?: number;
  units?: number;
  price: string;
  priceValue: number;
  type: ListingKind;
  image: string;
  href?: string;
};

/** @deprecated Static listings removed — use getPublishedListings() from lib/publicProperties */
export const listings: Listing[] = [];

export const PAGE_SIZE = 9;

export const propertyTypeOptions = ["All Types", "Residential", "Commercial", "Plot", "Rental"] as const;

/** Main-page societies only — custom admin societies are merged at runtime. */
export const BASE_LOCATION_OPTIONS = [
  "DHA Multan",
  "Royal Orchard",
  "Buch Villas",
  "Wapda Town",
] as const;

export const locationOptions = ["All Locations", ...BASE_LOCATION_OPTIONS] as const;

/** Base colonies + any custom society found on live listings. */
export function buildLocationOptions(listings: Pick<Listing, "location">[]): string[] {
  const base = [...BASE_LOCATION_OPTIONS];
  const custom = new Set<string>();

  for (const item of listings) {
    const loc = (item.location || "").trim();
    if (!loc) continue;

    const matchedBase = base.find((name) => loc.toLowerCase().includes(name.toLowerCase()));
    if (matchedBase) continue;

    const society = loc.split(",")[0]?.trim();
    if (society) custom.add(society);
  }

  return ["All Locations", ...base, ...[...custom].sort((a, b) => a.localeCompare(b))];
}

export const priceRangeOptions = [
  "Any Price",
  "Under PKR 50 Lakh",
  "PKR 50 Lakh – 2 Crore",
  "PKR 2 – 5 Crore",
  "PKR 5 Crore+",
  "Rentals",
] as const;

// Keep helpers available if needed by older imports
export { titleToSlug, uniqueSlug };
