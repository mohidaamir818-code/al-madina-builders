"use client";

import { useRef, useState } from "react";
import { Film, Loader2, X } from "lucide-react";
import { cn } from "@/lib/cn";

type VideoUploadGridProps = {
  videos: string[];
  onChange: (videos: string[]) => void;
  max?: number;
};

async function uploadVideo(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", "video");
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Video upload failed");
  return data.url;
}

export function VideoUploadGrid({ videos, onChange, max = 5 }: VideoUploadGridProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = max - videos.length;
    const selected = Array.from(files).slice(0, remaining);
    if (!selected.length) return;

    setUploading(true);
    setUploadError("");
    try {
      const urls: string[] = [];
      for (const file of selected) {
        urls.push(await uploadVideo(file));
      }
      onChange([...videos, ...urls].slice(0, max));
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
          <Film className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink sm:text-base">Property Videos</h2>
          <p className="text-xs text-muted">
            Uploads go to Supabase basket <span className="font-semibold text-ink">property-videos</span> (max {max},
            MP4/WEBM/MOV).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {videos.map((src, index) => (
          <div key={`${src.slice(-40)}-${index}`} className="relative overflow-hidden rounded border border-line bg-black">
            <video src={src} controls className="aspect-video w-full object-contain" preload="metadata" />
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange(videos.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white disabled:opacity-50"
              aria-label="Remove video"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {videos.length < max ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-video flex-col items-center justify-center gap-1 rounded border border-dashed border-primary bg-[#EAF7EE] text-sm font-semibold text-primary disabled:opacity-60",
            )}
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Film className="h-6 w-6" />}
            {uploading ? "Uploading…" : "Add Video"}
            <span className="text-xs font-normal text-muted">Under 50 MB</span>
          </button>
        ) : null}
      </div>

      {uploadError ? <p className="mt-2 text-xs text-red-600">{uploadError}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={(e) => void onPick(e.target.files)}
      />
    </div>
  );
}
