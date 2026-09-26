import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { uploadPropertyMedia, type UploadKind } from "@/lib/supabase/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const kindRaw = String(form.get("kind") || "image").toLowerCase();
    const kind: UploadKind = kindRaw === "video" ? "video" : "image";

    if (!(file instanceof File) || !file.size) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const result = await uploadPropertyMedia(kind, file);
    return NextResponse.json({
      url: result.url,
      bucket: result.bucket,
      path: result.path,
      kind,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
