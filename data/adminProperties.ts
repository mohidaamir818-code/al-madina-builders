export type SaleRent = "For Sale" | "For Rent";
export type BuildStatus = "In Progress" | "Grey Structure" | "Completed" | "On Hold";

/** Used for dashboard chip filters / badge colors */
export type AdminPropertyStatus = SaleRent | "In Progress" | "Completed" | "Grey Structure" | "On Hold";

export type AdminProperty = {
  id: string;
  slug: string;
  title: string;
  description: string;
  saleRent: SaleRent;
  buildStatus: BuildStatus;
  isDraft: boolean;
  propertyType: string;
  price: string;
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
  location: string;
  mapsLink: string;
  lat: number | null;
  lng: number | null;
  images: string[];
  videos: string[];
  additionalInfo: string;
  beds: number;
  baths: number;
  area: string;
  priceDisplay: string;
  image: string;
  status: AdminPropertyStatus;
  publicSlug?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export const ADMIN_STATUS_COLORS: Record<
  AdminPropertyStatus,
  { badge: string; pill: string; pillText: string }
> = {
  "For Sale": {
    badge: "bg-[#16A34A]",
    pill: "bg-[#DCFCE7]",
    pillText: "text-[#15803D]",
  },
  "For Rent": {
    badge: "bg-[#2563EB]",
    pill: "bg-[#DBEAFE]",
    pillText: "text-[#1D4ED8]",
  },
  "In Progress": {
    badge: "bg-[#F59E0B]",
    pill: "bg-[#FEF3C7]",
    pillText: "text-[#B45309]",
  },
  "Grey Structure": {
    badge: "bg-[#6B7280]",
    pill: "bg-[#F3F4F6]",
    pillText: "text-[#4B5563]",
  },
  Completed: {
    badge: "bg-[#14B8A6]",
    pill: "bg-[#CCFBF1]",
    pillText: "text-[#0F766E]",
  },
  "On Hold": {
    badge: "bg-[#DC2626]",
    pill: "bg-[#FEE2E2]",
    pillText: "text-[#B91C1C]",
  },
};

/** No demo seed — only real admin-added properties (Supabase). */
export const adminPropertySeed: AdminProperty[] = [];

export const DEFAULT_SELECT_OPTIONS: Record<string, string[]> = {
  propertyType: ["House", "Plot", "Apartment", "Commercial", "Villa", "Farmhouse"],
  saleRent: ["For Sale", "For Rent"],
  bedrooms: ["0", "1", "2", "3", "4", "5", "6+"],
  bathrooms: ["0", "1", "2", "3", "4", "5", "6+"],
  kitchens: ["0", "1", "2", "3"],
  tvLounge: ["0", "1", "2", "3"],
  carParking: ["0", "1", "2", "3", "4+"],
  facing: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West", "Corner"],
  totalFloors: ["1", "2", "2.5", "3", "3.5", "4", "5+"],
  condition: ["New", "Used", "Under Construction", "Renovated", "Grey Structure"],
  society: [
    "DHA Multan",
    "Royal Orchard",
    "Buch Villas",
    "Wapda Town",
  ],
};
