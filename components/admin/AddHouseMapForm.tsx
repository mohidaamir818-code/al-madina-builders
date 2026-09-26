"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, FileText, Map, Send, Star, StickyNote } from "lucide-react";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { PhotoUploadGrid } from "@/components/admin/PhotoUploadGrid";
import { cn } from "@/lib/cn";

export function AddHouseMapForm() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [featuredMeta, setFeaturedMeta] = useState<{ count: number; max: number; canFeature: boolean } | null>(
    null,
  );

  useEffect(() => {
    void fetch("/api/admin/featured")
      .then((r) => r.json())
      .then((data: { count?: number; max?: number; canFeature?: boolean }) => {
        setFeaturedMeta({
          count: Number(data.count) || 0,
          max: Number(data.max) || 20,
          canFeature: Boolean(data.canFeature),
        });
      })
      .catch(() => setFeaturedMeta({ count: 0, max: 20, canFeature: true }));
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!images.length) next.photos = "Add at least one plan photo.";
    if (!title.trim()) next.title = "Required";
    if (!description.trim()) next.description = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (asDraft: boolean) => {
    if (!asDraft && !validate()) {
      setToast("Zaruri fields incomplete hain.");
      return;
    }
    if (asDraft && !title.trim()) {
      setToast("Draft ke liye title likhein.");
      return;
    }
    setLoading(true);
    setToast("");
    try {
      const res = await fetch("/api/admin/house-maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          images,
          isDraft: asDraft,
          isFeatured,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToast(data.error || "Save failed");
        return;
      }
      setToast(asDraft ? "Draft saved" : "House map submitted");
      window.setTimeout(() => window.location.assign(`${ADMIN_BASE}/dashboard`), 500);
    } catch {
      setToast("Unable to save house map.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6F4] pb-10">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link
            href={`${ADMIN_BASE}/add-property`}
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-lg font-bold">Add House Map</p>
            <p className="text-xs text-white/80">Photos, title and description only</p>
          </div>
          <span className="w-9" />
        </div>
      </header>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          void save(false);
        }}
        className="mx-auto max-w-3xl space-y-4 px-4 py-4"
      >
        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <PhotoUploadGrid images={images} onChange={setImages} error={Boolean(errors.photos)} max={8} />
          {errors.photos ? <p className="mt-2 text-xs text-red-600">{errors.photos}</p> : null}
          <p className="mt-2 text-xs text-muted">Upload floor plan drawings and elevation photos.</p>
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <FileText className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold">Plan Details</h2>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium">Title*</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Marla Modern House Plan"
              className={cn(
                "h-11 w-full rounded border px-3 text-sm outline-none focus:border-primary",
                errors.title ? "border-red-400" : "border-line",
              )}
            />
          </label>

          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-medium">Description*</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe the house map / plan..."
              className={cn(
                "w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-primary",
                errors.description ? "border-red-400" : "border-line",
              )}
            />
          </label>
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-white">
                <Star className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-ink">Featured on Homepage</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Max {featuredMeta?.max ?? 20} featured (house + map). Currently{" "}
                  {featuredMeta?.count ?? "…"} / {featuredMeta?.max ?? 20}.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              disabled={!isFeatured && featuredMeta != null && !featuredMeta.canFeature}
              onClick={() => {
                if (!isFeatured && featuredMeta && !featuredMeta.canFeature) {
                  setToast(`Featured limit: max ${featuredMeta.max} hi allowed.`);
                  return;
                }
                setIsFeatured((v) => !v);
              }}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                isFeatured ? "bg-primary" : "bg-line",
                !isFeatured && featuredMeta && !featuredMeta.canFeature ? "opacity-50" : "",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                  isFeatured ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => void save(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded border border-brand bg-white text-sm font-semibold text-brand disabled:opacity-60"
          >
            <StickyNote className="h-4 w-4" />
            Save as Draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void save(false)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded bg-brand text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {loading ? "Saving…" : "Submit Map"}
          </button>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted">
          <Map className="h-3.5 w-3.5 text-primary" />
          Live maps appear on the public House Maps page.
        </p>
      </form>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
