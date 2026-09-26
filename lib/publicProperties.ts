import type { AdminProperty } from "@/data/adminProperties";
import type { Listing, ListingKind } from "@/data/listings";
import type { PropertyDetail, PropertyStat } from "@/data/propertyDetails";
import type { ConstructionProject, ProjectStatus, ProjectType } from "@/data/projects";
import { listAdminProperties } from "@/lib/admin/propertyStore";
import { getPublishedHouseMaps } from "@/lib/admin/houseMapStore";
import { MAX_FEATURED } from "@/lib/admin/featured";
import { site } from "@/data/site";

function mapKind(propertyType: string, saleRent: string): ListingKind {
  if (saleRent === "For Rent") return "Rental";
  const t = propertyType.toLowerCase();
  if (t.includes("plot")) return "Plot";
  if (t.includes("commercial") || t.includes("shop")) return "Commercial";
  return "Residential";
}

function mapProjectType(propertyType: string): ProjectType {
  const t = propertyType.toLowerCase();
  if (t.includes("industrial") || t.includes("warehouse") || t.includes("factory")) return "Industrial";
  if (t.includes("commercial") || t.includes("shop") || t.includes("plaza") || t.includes("mall")) return "Commercial";
  return "Residential";
}

function mapProjectStatus(buildStatus: AdminProperty["buildStatus"]): ProjectStatus {
  return buildStatus === "Completed" ? "Completed" : "Ongoing";
}

function mapProgress(buildStatus: AdminProperty["buildStatus"]): number {
  if (buildStatus === "Completed") return 100;
  if (buildStatus === "Grey Structure") return 40;
  if (buildStatus === "On Hold") return 25;
  return 65;
}

export function adminToListing(p: AdminProperty): Listing {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    badge: p.saleRent,
    location: p.location || p.address || p.society,
    area: p.area || p.size,
    beds: p.beds || undefined,
    baths: p.baths || undefined,
    price: p.priceDisplay || p.price,
    priceValue: Number(p.priceNumber.replace(/\D/g, "")) || 0,
    type: mapKind(p.propertyType, p.saleRent),
    image: p.image || p.images[0] || "/images/listing-house-dusk.jpg",
  };
}

export function adminToConstructionProject(p: AdminProperty): ConstructionProject {
  const type = mapProjectType(p.propertyType);
  return {
    id: p.slug,
    title: p.title,
    status: mapProjectStatus(p.buildStatus),
    location: p.location || p.address || p.society,
    type,
    area: p.area || p.size,
    beds: type === "Residential" && p.beds ? p.beds : undefined,
    baths: type === "Residential" && p.baths ? p.baths : undefined,
    extra: p.buildStatus === "Grey Structure" || p.buildStatus === "On Hold" ? p.buildStatus : undefined,
    progress: mapProgress(p.buildStatus),
    image: p.image || p.images[0] || "/images/listing-house-dusk.jpg",
  };
}

export function adminToPropertyDetail(p: AdminProperty): PropertyDetail {
  const stats: PropertyStat[] = [
    { key: "bedrooms", label: "Bedrooms", value: p.bedrooms || p.beds, icon: "bed" },
    { key: "bathrooms", label: "Bathrooms", value: p.bathrooms || p.baths, icon: "bath" },
    { key: "kitchen", label: "Kitchen", value: p.kitchens || "1", icon: "kitchen" },
    { key: "tvLounge", label: "TV Lounge", value: p.tvLounge || "1", icon: "lounge" },
    { key: "carParking", label: "Car Parking", value: p.carParking || "1", icon: "parking" },
  ];

  if (p.propertyType.toLowerCase().includes("plot")) {
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.society || p.location,
      status: p.saleRent,
      price: p.priceDisplay || p.price,
      negotiable: p.saleRent === "For Sale",
      fullAddress: p.address || p.location,
      images: p.images.length ? p.images : [p.image],
      videos: p.videos || [],
      stats: [
        { key: "area", label: "Area", value: p.size || p.area, icon: "area" },
        { key: "facing", label: "Facing", value: p.facing || "—", icon: "lounge" },
        { key: "condition", label: "Condition", value: p.condition || "—", icon: "kitchen" },
        { key: "type", label: "Type", value: p.propertyType, icon: "shop" },
        { key: "parking", label: "Access", value: p.carParking || "—", icon: "parking" },
      ],
      details: {
        propertyType: p.propertyType,
        size: p.size || p.area,
        facing: p.facing,
        totalFloors: p.totalFloors || "N/A",
        condition: p.condition,
        location: p.location,
        price: p.priceDisplay || p.price,
        availability: p.saleRent,
        possession: p.buildStatus === "Completed" ? "Ready to Move" : p.buildStatus,
        installment: "No",
      },
      description: p.description,
      keyFeatures: p.additionalInfo
        ? p.additionalInfo
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 8)
        : ["Clear Title", "Prime Location", "Verified Listing"],
      mapCoordinates: { lat: p.lat ?? 30.1575, lng: p.lng ?? 71.5249 },
      mapsLink: p.mapsLink || undefined,
      whatsappNumber: site.whatsapp,
      callNumber: site.phoneTel,
      callDisplay: site.phone,
      type: "Plot",
      listingImage: p.image,
    };
  }

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.society || p.location,
    status: p.saleRent,
    price: p.priceDisplay || p.price,
    negotiable: p.saleRent === "For Sale",
    fullAddress: p.address || p.location,
    images: p.images.length ? p.images : [p.image],
    videos: p.videos || [],
    stats,
    details: {
      propertyType: p.propertyType,
      size: p.size || p.area,
      facing: p.facing,
      totalFloors: p.totalFloors,
      condition: p.condition,
      location: p.location,
      price: p.priceDisplay || p.price,
      availability: p.saleRent,
      possession: p.buildStatus === "Completed" ? "Ready to Move" : p.buildStatus,
      installment: "No",
    },
    description: p.description,
    keyFeatures: p.additionalInfo
      ? p.additionalInfo
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 8)
      : ["Spacious Layout", "Prime Location", "Verified Listing", "Quality Construction"],
    mapCoordinates: { lat: p.lat ?? 30.1575, lng: p.lng ?? 71.5249 },
    mapsLink: p.mapsLink || undefined,
    whatsappNumber: site.whatsapp,
    callNumber: site.phoneTel,
    callDisplay: site.phone,
    type: mapKind(p.propertyType, p.saleRent),
    listingImage: p.image,
  };
}

/** Published (non-draft) properties from admin / Supabase only. */
export async function getPublishedListings(): Promise<Listing[]> {
  const all = await listAdminProperties();
  return all.filter((p) => !p.isDraft).map(adminToListing);
}

export async function getPublishedPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  const all = await listAdminProperties();
  const found = all.find(
    (p) => !p.isDraft && (p.slug === slug || p.publicSlug === slug || p.id === slug),
  );
  return found ? adminToPropertyDetail(found) : null;
}

export async function getPublishedPropertySlugs(): Promise<string[]> {
  const all = await listAdminProperties();
  return all.filter((p) => !p.isDraft).map((p) => p.slug);
}

export async function getFeaturedListings(limit = MAX_FEATURED): Promise<Listing[]> {
  const [properties, maps] = await Promise.all([listAdminProperties(), getPublishedHouseMaps()]);

  const featuredProps = properties
    .filter((p) => !p.isDraft && p.isFeatured)
    .map((p) => ({
      listing: adminToListing(p),
      updatedAt: p.updatedAt,
    }));

  const featuredMaps = maps
    .filter((m) => m.isFeatured)
    .map((m) => ({
      listing: {
        id: m.id,
        slug: m.slug,
        title: m.title,
        badge: "House Map" as const,
        location: "House Map",
        area: m.sqft ? `${m.sqft} sqft` : "Floor Plan",
        beds: m.beds || undefined,
        baths: m.baths || undefined,
        price: m.price || "Custom Plan",
        priceValue: Number(m.priceNumber.replace(/\D/g, "")) || 0,
        type: "Residential" as ListingKind,
        image: m.image || m.images[0] || "/images/floorplan-5marla.jpg",
        href: `/house-maps/${m.slug}`,
      } satisfies Listing,
      updatedAt: m.updatedAt,
    }));

  return [...featuredProps, ...featuredMaps]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, Math.min(limit, MAX_FEATURED))
    .map((item) => item.listing);
}

/** Published admin properties shown as construction projects. */
export async function getPublishedConstructionProjects(): Promise<ConstructionProject[]> {
  const all = await listAdminProperties();
  return all.filter((p) => !p.isDraft).map(adminToConstructionProject);
}

export async function getConstructionProjectById(id: string): Promise<ConstructionProject | null> {
  const all = await listAdminProperties();
  const found = all.find(
    (p) => !p.isDraft && (p.slug === id || p.publicSlug === id || p.id === id),
  );
  return found ? adminToConstructionProject(found) : null;
}
