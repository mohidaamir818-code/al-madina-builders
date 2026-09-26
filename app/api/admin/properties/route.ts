import { NextResponse } from "next/server";
import type { BuildStatus, SaleRent } from "@/data/adminProperties";
import { requireAdminSession } from "@/lib/admin/cookies";
import { assertCanMarkFeatured } from "@/lib/admin/featured";
import { createAdminProperty, listAdminProperties } from "@/lib/admin/propertyStore";

const SALE: SaleRent[] = ["For Sale", "For Rent"];
const BUILD: BuildStatus[] = ["In Progress", "Grey Structure", "Completed", "On Hold"];

function parseLatLng(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseBody(body: Record<string, unknown>) {
  const saleRent = body.saleRent as SaleRent;
  const buildStatus = body.buildStatus as BuildStatus;
  return {
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    saleRent,
    buildStatus,
    isDraft: Boolean(body.isDraft),
    propertyType: String(body.propertyType || "House").trim(),
    priceNumber: String(body.priceNumber || "").replace(/\D/g, ""),
    size: String(body.size || "").trim(),
    bedrooms: String(body.bedrooms || "0"),
    bathrooms: String(body.bathrooms || "0"),
    kitchens: String(body.kitchens || "0"),
    tvLounge: String(body.tvLounge || "0"),
    carParking: String(body.carParking || "0"),
    facing: String(body.facing || "").trim(),
    totalFloors: String(body.totalFloors || "").trim(),
    condition: String(body.condition || "").trim(),
    society: String(body.society || "").trim(),
    address: String(body.address || "").trim(),
    mapsLink: String(body.mapsLink || "").trim(),
    lat: parseLatLng(body.lat),
    lng: parseLatLng(body.lng),
    images: Array.isArray(body.images) ? (body.images as string[]).filter(Boolean) : undefined,
    videos: Array.isArray(body.videos) ? (body.videos as string[]).filter(Boolean) : undefined,
    additionalInfo: String(body.additionalInfo || ""),
    publicSlug: typeof body.publicSlug === "string" ? body.publicSlug : undefined,
    isFeatured: Boolean(body.isFeatured),
  };
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const properties = await listAdminProperties();
  return NextResponse.json({ properties });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = parseBody(body);

    if (!input.isDraft) {
      if (!input.title || !input.description || !SALE.includes(input.saleRent) || !BUILD.includes(input.buildStatus)) {
        return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
      }
      if (!input.images?.length) {
        return NextResponse.json({ error: "At least one photo is required." }, { status: 400 });
      }
    } else if (!input.title) {
      return NextResponse.json({ error: "Draft needs a title." }, { status: 400 });
    }

    if (!SALE.includes(input.saleRent)) input.saleRent = "For Sale";
    if (!BUILD.includes(input.buildStatus)) input.buildStatus = "In Progress";

    if (input.isFeatured && !input.isDraft) {
      await assertCanMarkFeatured(true);
    }

    const property = await createAdminProperty(input);
    return NextResponse.json({ property }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to create property.";
    console.error("[admin/properties POST]", err);
    const status = /Featured limit/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
