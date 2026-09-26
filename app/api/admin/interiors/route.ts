import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { createAdminInterior, listAdminInteriors } from "@/lib/admin/interiorStore";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const interiors = await listAdminInteriors();
  return NextResponse.json({ interiors });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const isDraft = Boolean(body.isDraft);
    const title = String(body.title || "").trim();
    const images = Array.isArray(body.images) ? (body.images as string[]).filter(Boolean) : [];

    if (!isDraft) {
      if (!title || !images.length || !String(body.description || "").trim()) {
        return NextResponse.json({ error: "Photos, title and description are required." }, { status: 400 });
      }
    } else if (!title) {
      return NextResponse.json({ error: "Draft needs a title." }, { status: 400 });
    }

    const interior = await createAdminInterior({
      title,
      category: String(body.category || "Living Room").trim() || "Living Room",
      location: String(body.location || "").trim(),
      description: String(body.description || "").trim(),
      priceNumber: String(body.priceNumber || "").replace(/\D/g, "") || "0",
      rating: Number(body.rating) || 4.8,
      reviews: Number(body.reviews) || 0,
      images,
      features: Array.isArray(body.features) ? (body.features as string[]) : [],
      isDraft,
    });

    return NextResponse.json({ interior }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to create interior design.";
    console.error("[admin/interiors POST]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
