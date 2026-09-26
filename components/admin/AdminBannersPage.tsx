"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { BANNER_PAGES, type BannerButton, type BannerPageKey } from "@/data/banners";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { AdminShell } from "@/components/admin/AdminShell";
import { cn } from "@/lib/cn";

type Draft = {
  pageKey: BannerPageKey;
  title: string;
  subtitle: string;
  eyebrow: string;
  scriptText: string;
  imageUrl: string;
  buttons: BannerButton[];
  isActive: boolean;
};

function emptyDraft(pageKey: BannerPageKey): Draft {
  const meta = BANNER_PAGES.find((p) => p.key === pageKey)!;
  return {
    pageKey,
    title: "",
    subtitle: "",
    eyebrow: "",
    scriptText: "",
    imageUrl: meta.defaultImage,
    buttons: [{ label: "Learn More", href: "/", style: "primary" }],
    isActive: true,
  };
}

function fromBanner(b: SiteBanner): Draft {
  return {
    pageKey: b.pageKey,
    title: b.title,
    subtitle: b.subtitle,
    eyebrow: b.eyebrow,
    scriptText: b.scriptText,
    imageUrl: b.imageUrl,
    buttons: b.buttons.length ? b.buttons : [],
    isActive: b.isActive,
  };
}

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", "image");
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
  return data.url;
}

export function AdminBannersPage({ initialBanners }: { initialBanners: SiteBanner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [selectedKey, setSelectedKey] = useState<BannerPageKey>("home");
  const [draft, setDraft] = useState<Draft>(() => emptyDraft("home"));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const savedMap = useMemo(() => {
    const map = new Map<string, SiteBanner>();
    for (const b of banners) map.set(b.pageKey, b);
    return map;
  }, [banners]);

  const meta = BANNER_PAGES.find((p) => p.key === selectedKey)!;

  useEffect(() => {
    const existing = savedMap.get(selectedKey);
    setDraft(existing ? fromBanner(existing) : emptyDraft(selectedKey));
  }, [selectedKey, savedMap]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2800);
  };

  const onUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setDraft((d) => ({ ...d, imageUrl: url }));
      showToast("Image uploaded");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const setButton = (index: number, patch: Partial<BannerButton>) => {
    setDraft((d) => ({
      ...d,
      buttons: d.buttons.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }));
  };

  const addButton = () => {
    if (draft.buttons.length >= 6) {
      showToast("Max 6 buttons per banner");
      return;
    }
    setDraft((d) => ({
      ...d,
      buttons: [...d.buttons, { label: "New Button", href: "/", style: "primary" }],
    }));
  };

  const removeButton = (index: number) => {
    setDraft((d) => ({ ...d, buttons: d.buttons.filter((_, i) => i !== index) }));
  };

  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!draft.imageUrl.trim()) {
      showToast("Banner image required");
      return;
    }
    const buttons = draft.buttons.filter((b) => b.label.trim() && b.href.trim());
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, buttons }),
      });
      const data = (await res.json()) as { banner?: SiteBanner; error?: string };
      if (!res.ok || !data.banner) {
        showToast(data.error || "Save failed");
        return;
      }
      setBanners((prev) => {
        const next = prev.filter((b) => b.pageKey !== data.banner!.pageKey);
        next.unshift(data.banner!);
        return next;
      });
      showToast("Banner saved");
    } catch {
      showToast("Network error");
    } finally {
      setLoading(false);
    }
  };

  const resetToDefault = async () => {
    if (!confirm("Remove custom banner for this page? Site will use the default image again.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/banners/${encodeURIComponent(selectedKey)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Could not reset");
        return;
      }
      setBanners((prev) => prev.filter((b) => b.pageKey !== selectedKey));
      setDraft(emptyDraft(selectedKey));
      showToast("Reset to default");
    } catch {
      showToast("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell messageCount={0}>
      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href={`${ADMIN_BASE}/dashboard`}
            className="flex h-9 w-9 items-center justify-center rounded border border-line bg-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-ink">Manage Banners</h1>
            <p className="text-xs text-muted">Har page ka banner, image aur buttons yahan se control karein.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* Page list */}
          <aside className="rounded-md border border-line bg-white p-2 shadow-sm">
            <p className="px-2 py-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
              Pages with banners
            </p>
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
              {BANNER_PAGES.map((page) => {
                const hasCustom = savedMap.has(page.key);
                return (
                  <li key={page.key}>
                    <button
                      type="button"
                      onClick={() => setSelectedKey(page.key)}
                      className={cn(
                        "w-full rounded px-3 py-2.5 text-left text-sm transition-colors",
                        selectedKey === page.key
                          ? "bg-[#EAF7EE] font-semibold text-brand"
                          : "text-ink hover:bg-mint",
                      )}
                    >
                      <span className="block">{page.label}</span>
                      <span className="mt-0.5 block text-[11px] font-normal text-muted">
                        {hasCustom ? "Custom uploaded" : "Default image"} · {page.recommendedSize}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Editor */}
          <form onSubmit={save} className="space-y-4 rounded-md border border-line bg-white p-4 shadow-sm sm:p-5">
            <div>
              <h2 className="text-base font-bold text-ink">{meta.label}</h2>
              <p className="mt-1 text-sm text-muted">{meta.description}</p>
              <div className="mt-3 rounded border border-dashed border-primary/40 bg-[#F3FBF5] px-3 py-2.5 text-xs text-ink">
                <p className="font-semibold text-primary">Best image size</p>
                <p className="mt-1">
                  <span className="font-bold">{meta.recommendedSize}</span>
                  <span className="text-muted"> — {meta.aspectHint}</span>
                </p>
                <p className="mt-1 text-muted">JPG / PNG / WEBP, max 10 MB. Wide landscape best dikhega.</p>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <div className="relative aspect-[16/7] overflow-hidden rounded border border-line bg-[#F3F6F4]">
                {draft.imageUrl ? (
                  <Image
                    src={draft.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={draft.imageUrl.includes("supabase") || draft.imageUrl.startsWith("data:")}
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                ) : null}
                {uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex h-10 items-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload Banner Image"}
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => void onUpload(e.target.files)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-medium">Eyebrow / small label</span>
                <input
                  value={draft.eyebrow}
                  onChange={(e) => setDraft((d) => ({ ...d, eyebrow: e.target.value }))}
                  placeholder="e.g. Trusted • Professional • Reliable"
                  className="h-11 w-full rounded border border-line px-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-medium">Title / Heading</span>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Main headline"
                  className="h-11 w-full rounded border border-line px-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-medium">Subtitle / supporting text</span>
                <textarea
                  value={draft.subtitle}
                  onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
                  rows={3}
                  placeholder="Short supporting sentence"
                  className="w-full rounded border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-medium">Script / handwriting text (optional)</span>
                <input
                  value={draft.scriptText}
                  onChange={(e) => setDraft((d) => ({ ...d, scriptText: e.target.value }))}
                  placeholder="e.g. Build Your Future With Us"
                  className="h-11 w-full rounded border border-line px-3 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="rounded border border-line p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-ink">Banner Buttons</h3>
                  <p className="text-xs text-muted">1 se zyada buttons add kar sakte ho — har button ka apna URL.</p>
                </div>
                <button
                  type="button"
                  onClick={addButton}
                  className="inline-flex h-9 items-center gap-1 rounded border border-brand px-3 text-xs font-semibold text-brand"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Button
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {draft.buttons.length === 0 ? (
                  <p className="text-xs text-muted">No buttons yet. Add at least one if you want CTAs.</p>
                ) : null}
                {draft.buttons.map((btn, index) => (
                  <div key={index} className="rounded border border-line bg-[#F8FAF8] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-ink">Button {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeButton(index)}
                        className="text-muted hover:text-red-600"
                        aria-label="Remove button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium">Button text</span>
                        <input
                          value={btn.label}
                          onChange={(e) => setButton(index, { label: e.target.value })}
                          placeholder="View Properties"
                          className="h-10 w-full rounded border border-line bg-white px-3 text-sm outline-none focus:border-primary"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium">Style</span>
                        <select
                          value={btn.style}
                          onChange={(e) =>
                            setButton(index, {
                              style: e.target.value === "outline" ? "outline" : "primary",
                            })
                          }
                          className="h-10 w-full rounded border border-line bg-white px-3 text-sm outline-none focus:border-primary"
                        >
                          <option value="primary">Green (primary)</option>
                          <option value="outline">White outline</option>
                        </select>
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="mb-1 block text-[11px] font-medium">
                          URL (button dabane ke baad kahan jaye)
                        </span>
                        <input
                          value={btn.href}
                          onChange={(e) => setButton(index, { href: e.target.value })}
                          placeholder="/properties  or  https://wa.me/923056767965"
                          className="h-10 w-full rounded border border-line bg-white px-3 text-sm outline-none focus:border-primary"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              Active (public site pe dikhao)
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded bg-brand text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving…" : "Save Banner"}
              </button>
              <button
                type="button"
                disabled={loading || !savedMap.has(selectedKey)}
                onClick={() => void resetToDefault()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Reset Default
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </AdminShell>
  );
}
