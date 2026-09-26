import { NextResponse } from "next/server";
import type { BuildStatus, SaleRent } from "@/data/adminProperties";
import { requireAdminSession } from "@/lib/admin/cookies";
import { assertCanMarkFeatured } from "@/lib/admin/featured";
import {
  deleteAdminProperty,
  getAdminProperty,
  getAdminPropertyBySlug,
  updateAdminProperty,
  updateAdminPropertyBySlug,
} from "@/lib/admin/propertyStore";

const SALE: SaleRent[] = ["For Sale", "For Rent"];
const BUILD: BuildStatus[] = ["In Progress", "Grey Structure", "Completed", "On Hold"];

type Ctx = { params: Promise<{ id: string }> };

function parseBody(body: Record<string, unknown>) {
  const saleRent = body.saleRent as SaleRent;
  const buildStatus = body.buildStatus as BuildStatus;
  return {
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    saleRent: SALE.includes(saleRent) ? saleRent : ("For Sale" as SaleRent),
    buildStatus: BUILD.includes(buildStatus) ? buildStatus : ("In Progress" as BuildStatus),
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
    lat: typeof body.lat === "number" ? body.lat : body.lat == null ? null : Number(body.lat),
    lng: typeof body.lng === "number" ? body.lng : body.lng == null ? null : Number(body.lng),
    images: Array.isArray(body.images) ? (body.images as string[]).filter(Boolean) : undefined,
    videos: Array.isArray(body.videos) ? (body.videos as string[]).filter(Boolean) : undefined,
    additionalInfo: String(body.additionalInfo || ""),
    publicSlug: typeof body.publicSlug === "string" ? body.publicSlug : undefined,
    isFeatured: Boolean(body.isFeatured),
  };
}

export async function GET(_request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const property = await getAdminProperty(id);
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PUT(request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = parseBody(body);
    if (!input.isDraft && (!input.title || !input.description)) {
      return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
    }
    const existing = (await getAdminProperty(id)) || (await getAdminPropertyBySlug(id));
    if (input.isFeatured && !input.isDraft) {
      await assertCanMarkFeatured(true, existing?.id);
    }
    const byId = await updateAdminProperty(id, input);
    const property = byId || (await updateAdminPropertyBySlug(id, input));
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ property });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to update property.";
    console.error("[admin/properties PUT]", err);
    const status = /Featured limit/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const ok = await deleteAdminProperty(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
