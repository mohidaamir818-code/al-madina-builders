"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/cn";

type PhotoUploadGridProps = {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  error?: boolean;
};

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", "image");
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Image upload failed");
  return data.url;
}

export function PhotoUploadGrid({ images, onChange, max = 10, error }: PhotoUploadGridProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = max - images.length;
    const selected = Array.from(files).slice(0, remaining);
    if (!selected.length) return;

    setUploading(true);
    setUploadError("");
    try {
      const urls: string[] = [];
      for (const file of selected) {
        urls.push(await uploadImage(file));
      }
      onChange([...images, ...urls].slice(0, max));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-start gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
          <ImagePlus className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink sm:text-base">Property Photos</h2>
          <p className="text-xs text-muted">
            Uploads go to Supabase basket <span className="font-semibold text-ink">property-images</span> (max {max}).
          </p>
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5",
          error && "rounded border border-red-300 p-2",
        )}
      >
        {images.map((src, index) => (
          <div key={`${src.slice(-40)}-${index}`} className="relative aspect-square overflow-hidden rounded border border-line">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              unoptimized={src.startsWith("data:") || src.includes("supabase")}
              sizes="120px"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white disabled:opacity-50"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < max ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded border border-dashed border-primary bg-[#EAF7EE] text-center text-[10px] font-semibold text-primary disabled:opacity-60 sm:text-xs"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            {uploading ? "Uploading…" : "Add Photos"}
            <span className="font-normal text-muted">(Max {max})</span>
          </button>
        ) : null}
      </div>

      {uploadError ? <p className="mt-2 text-xs text-red-600">{uploadError}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        className="hidden"
        onChange={(e) => void onPick(e.target.files)}
      />
    </div>
  );
}
