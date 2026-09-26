import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const IMAGE_BUCKET = "property-images";
export const VIDEO_BUCKET = "property-videos";

export type UploadKind = "image" | "video";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export function bucketForKind(kind: UploadKind) {
  return kind === "video" ? VIDEO_BUCKET : IMAGE_BUCKET;
}

export function validateUpload(kind: UploadKind, file: File) {
  const type = (file.type || "").toLowerCase();
  if (kind === "image") {
    if (!IMAGE_TYPES.has(type)) {
      return { ok: false as const, error: "Only JPG, PNG, WEBP, GIF, or AVIF images are allowed." };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false as const, error: "Image must be under 10 MB." };
    }
  } else {
    if (!VIDEO_TYPES.has(type)) {
      return { ok: false as const, error: "Only MP4, WEBM, or MOV videos are allowed." };
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return { ok: false as const, error: "Video must be under 50 MB." };
    }
  }
  return { ok: true as const };
}

function safeExt(fileName: string, mime: string, kind: UploadKind) {
  const fromName = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (fromName && fromName.length <= 5) return fromName;
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("avif")) return "avif";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("quicktime")) return "mov";
  return kind === "video" ? "mp4" : "jpg";
}

/** Upload a file to the correct Supabase Storage basket; returns public URL. */
export async function uploadPropertyMedia(kind: UploadKind, file: File) {
  const check = validateUpload(kind, file);
  if (!check.ok) throw new Error(check.error);

  const bucket = bucketForKind(kind);
  const ext = safeExt(file.name, file.type, kind);
  const path = `${kind}s/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const sb = getSupabaseAdmin();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || (kind === "video" ? "video/mp4" : "image/jpeg"),
    upsert: false,
    cacheControl: "3600",
  });
  if (error) throw new Error(error.message);

  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, bucket, path };
}
