import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "GOOGLE_MAPS_API_KEY is not configured." }, { status: 503 });
  }

  const placeId = new URL(request.url).searchParams.get("placeId")?.trim();
  if (!placeId) {
    return NextResponse.json({ error: "placeId required" }, { status: 400 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "geometry,formatted_address,name");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    result?: {
      formatted_address?: string;
      name?: string;
      geometry?: { location?: { lat: number; lng: number } };
    };
  };

  if (data.status !== "OK" || !data.result?.geometry?.location) {
    return NextResponse.json(
      { error: data.error_message || `Place details failed (${data.status})` },
      { status: 502 },
    );
  }

  const { lat, lng } = data.result.geometry.location;
  const label = data.result.formatted_address || data.result.name || `${lat}, ${lng}`;

  return NextResponse.json({
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    label,
  });
}
