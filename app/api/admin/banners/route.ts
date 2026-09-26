import { NextResponse } from "next/server";
import { isBannerPageKey, type BannerButton } from "@/data/banners";
import { requireAdminSession } from "@/lib/admin/cookies";
import { listSiteBanners, upsertSiteBanner } from "@/lib/admin/bannerStore";

function parseButtons(raw: unknown): BannerButton[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = (item || {}) as Record<string, unknown>;
      const label = String(row.label || "").trim();
      const href = String(row.href || "").trim();
      if (!label || !href) return null;
      return {
        label,
        href,
        style: row.style === "outline" ? ("outline" as const) : ("primary" as const),
      };
    })
    .filter((b): b is BannerButton => Boolean(b))
    .slice(0, 6);
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const banners = await listSiteBanners();
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const pageKey = String(body.pageKey || "");
    if (!isBannerPageKey(pageKey)) {
      return NextResponse.json({ error: "Invalid page selected." }, { status: 400 });
    }

    const imageUrl = String(body.imageUrl || "").trim();
    if (!imageUrl) {
      return NextResponse.json({ error: "Laptop / desktop banner image is required." }, { status: 400 });
    }

    const banner = await upsertSiteBanner({
      pageKey,
      title: String(body.title || ""),
      subtitle: String(body.subtitle || ""),
      eyebrow: String(body.eyebrow || ""),
      scriptText: String(body.scriptText || ""),
      imageUrl,
      mobileImageUrl: String(body.mobileImageUrl || "").trim(),
      buttons: parseButtons(body.buttons),
      isActive: body.isActive !== false,
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to save banner.";
    console.error("[admin/banners POST]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
