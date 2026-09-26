import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { extractLatLngFromMapsUrl, isLikelyMapsUrl } from "@/lib/admin/mapsParse";

async function resolveFinalUrl(url: string) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AlMadinaAdmin/1.0; +https://almadina.local)",
    },
  });
  return res.url || url;
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as { url?: string };
    const url = String(body.url || "").trim();
    if (!url || !isLikelyMapsUrl(url)) {
      return NextResponse.json(
        {
          error:
            "Location link samajh nahi aaya, dobara try karein ya search/drag use karein.",
        },
        { status: 400 },
      );
    }

    let parsed = extractLatLngFromMapsUrl(url);
    let finalUrl = url;

    if (!parsed) {
      try {
        finalUrl = await resolveFinalUrl(url);
        parsed = extractLatLngFromMapsUrl(finalUrl);
      } catch {
        /* fall through */
      }
    }

    // Some short links only expose coords after a second hop in Location header text
    if (!parsed && finalUrl !== url) {
      parsed = extractLatLngFromMapsUrl(decodeURIComponent(finalUrl));
    }

    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "Location link samajh nahi aaya, dobara try karein ya search/drag use karein.",
        },
        { status: 422 },
      );
    }

    const lat = Number(parsed.lat.toFixed(6));
    const lng = Number(parsed.lng.toFixed(6));
    const label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    return NextResponse.json({ lat, lng, label, finalUrl });
  } catch {
    return NextResponse.json(
      {
        error:
          "Location link samajh nahi aaya, dobara try karein ya search/drag use karein.",
      },
      { status: 500 },
    );
  }
}
