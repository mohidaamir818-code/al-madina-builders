import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { assertCanMarkFeatured } from "@/lib/admin/featured";
import { createAdminHouseMap, listAdminHouseMaps } from "@/lib/admin/houseMapStore";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const maps = await listAdminHouseMaps();
  return NextResponse.json({ maps });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const isDraft = Boolean(body.isDraft);
    const isFeatured = Boolean(body.isFeatured);
    const title = String(body.title || "").trim();
    const images = Array.isArray(body.images) ? (body.images as string[]).filter(Boolean) : [];

    if (!isDraft) {
      if (!title || !images.length || !String(body.description || "").trim()) {
        return NextResponse.json({ error: "Photos, title and description are required." }, { status: 400 });
      }
    } else if (!title) {
      return NextResponse.json({ error: "Draft needs a title." }, { status: 400 });
    }

    if (isFeatured && !isDraft) {
      await assertCanMarkFeatured(true);
    }

    const map = await createAdminHouseMap({
      title,
      badge: String(body.badge || "").trim(),
      description: String(body.description || "").trim(),
      beds: Number(body.beds) || 0,
      baths: Number(body.baths) || 0,
      sqft: Number(body.sqft) || 0,
      floors: Number(body.floors) || 1,
      priceNumber: String(body.priceNumber || "").replace(/\D/g, "") || "0",
      images,
      features: Array.isArray(body.features) ? (body.features as string[]) : [],
      isDraft,
      isFeatured,
    });

    return NextResponse.json({ map }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to create house map.";
    console.error("[admin/house-maps POST]", err);
    const status = /Featured limit/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
