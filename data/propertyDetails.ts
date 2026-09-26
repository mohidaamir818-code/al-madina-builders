import { listings, type Listing, type ListingKind } from "@/data/listings";
import { site } from "@/data/site";

export type PropertyStat = {
  key: string;
  label: string;
  value: number | string;
  icon: "bed" | "bath" | "kitchen" | "lounge" | "parking" | "area" | "shop" | "unit";
};

export type PropertyDetailFields = {
  propertyType: string;
  size: string;
  facing: string;
  totalFloors: string;
  condition: string;
  location: string;
  price: string;
  availability: string;
  possession: string;
  installment: string;
};

export type PropertyDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: "For Sale" | "For Rent";
  price: string;
  negotiable: boolean;
  fullAddress: string;
  images: string[];
  videos: string[];
  stats: PropertyStat[];
  details: PropertyDetailFields;
  description: string;
  keyFeatures: string[];
  mapCoordinates: { lat: number; lng: number };
  mapsLink?: string;
  whatsappNumber: string;
  callNumber: string;
  callDisplay: string;
  type: ListingKind;
  listingImage: string;
};

/** Static property details removed — use getPublishedPropertyBySlug from lib/publicProperties */
export const propertyDetails: PropertyDetail[] = [];

export function getPropertyBySlug(_slug: string): PropertyDetail | undefined {
  return undefined;
}

export function getAllPropertySlugs() {
  return [] as string[];
}

// silence unused import lint for listings re-export compatibility
void listings;
void site;
