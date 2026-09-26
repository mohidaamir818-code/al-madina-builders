import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";

type Prediction = { placeId: string; description: string };

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured.", predictions: [] },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const input = (searchParams.get("q") || "").trim();
  if (input.length < 2) {
    return NextResponse.json({ predictions: [] as Prediction[] });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("key", key);
  url.searchParams.set("components", "country:pk");

  const res = await fetch(url.toString());
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    predictions?: Array<{ place_id: string; description: string }>;
  };

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return NextResponse.json(
      {
        error: data.error_message || `Places autocomplete failed (${data.status})`,
        predictions: [],
      },
      { status: 502 },
    );
  }

  const predictions: Prediction[] = (data.predictions || []).map((p) => ({
    placeId: p.place_id,
    description: p.description,
  }));

  return NextResponse.json({ predictions });
}
