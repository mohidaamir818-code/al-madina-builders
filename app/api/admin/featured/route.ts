import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { countFeaturedListings, MAX_FEATURED } from "@/lib/admin/featured";

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const excludeId = searchParams.get("excludeId") || undefined;
  const count = await countFeaturedListings(excludeId || undefined);

  return NextResponse.json({
    count,
    max: MAX_FEATURED,
    canFeature: count < MAX_FEATURED,
  });
}
