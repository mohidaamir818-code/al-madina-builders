"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ClipboardList,
  FileText,
  Home,
  Info,
  MapPin,
  Send,
  Star,
  StickyNote,
} from "lucide-react";
import type { AdminProperty, BuildStatus, SaleRent } from "@/data/adminProperties";
import { DEFAULT_SELECT_OPTIONS } from "@/data/adminProperties";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { CustomSelect } from "@/components/admin/CustomSelect";
import { PhotoUploadGrid } from "@/components/admin/PhotoUploadGrid";
import { VideoUploadGrid } from "@/components/admin/VideoUploadGrid";
import { PropertyStatusSelector } from "@/components/admin/PropertyStatusSelector";
import { MapsLinkField } from "@/components/admin/MapsLinkField";
import { cn } from "@/lib/cn";

const DESC_MAX = 1000;

type FormState = {
  images: string[];
  videos: string[];
  title: string;
  description: string;
  propertyType: string;
  saleRent: SaleRent;
  priceNumber: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  tvLounge: string;
  carParking: string;
  facing: string;
  totalFloors: string;
  condition: string;
  society: string;
  address: string;
  mapsLink: string;
  lat: number | null;
  lng: number | null;
  buildStatus: BuildStatus;
  additionalInfo: string;
  isFeatured: boolean;
};

type Errors = Partial<Record<keyof FormState | "photos", string>>;

function fromInitial(initial?: AdminProperty): FormState {
  return {
    images: initial?.images?.length ? initial.images : initial?.image ? [initial.image] : [],
    videos: initial?.videos?.length ? initial.videos : [],
    title: initial?.title || "",
    description: initial?.description || "",
    propertyType: initial?.propertyType || "House",
    saleRent: initial?.saleRent || "For Sale",
    priceNumber: initial?.priceNumber || (initial?.price || "").replace(/\D/g, ""),
    size: initial?.size || initial?.area || "",
    bedrooms: initial?.bedrooms ?? (initial?.beds != null ? String(initial.beds) : ""),
    bathrooms: initial?.bathrooms ?? (initial?.baths != null ? String(initial.baths) : ""),
    kitchens: initial?.kitchens || "",
    tvLounge: initial?.tvLounge || "",
    carParking: initial?.carParking || "",
    facing: initial?.facing || "",
    totalFloors: initial?.totalFloors || "",
    condition: initial?.condition || "",
    society: initial?.society || "",
    address: initial?.address || initial?.location || "",
    mapsLink: initial?.mapsLink || "",
    lat: initial?.lat ?? null,
    lng: initial?.lng ?? null,
    buildStatus: initial?.buildStatus || "In Progress",
    additionalInfo: initial?.additionalInfo || "",
    isFeatured: Boolean(initial?.isFeatured),
  };
}

type AddEditPropertyFormProps = {
  mode: "add" | "edit";
  initial?: AdminProperty;
};

export function AddEditPropertyForm({ mode, initial }: AddEditPropertyFormProps) {
  const [form, setForm] = useState<FormState>(() => fromInitial(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [featuredMeta, setFeaturedMeta] = useState<{ count: number; max: number; canFeature: boolean } | null>(
    null,
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const exclude = initial?.id ? `?excludeId=${encodeURIComponent(initial.id)}` : "";
    void fetch(`/api/admin/featured${exclude}`)
      .then((r) => r.json())
      .then((data: { count?: number; max?: number; canFeature?: boolean }) => {
        setFeaturedMeta({
          count: Number(data.count) || 0,
          max: Number(data.max) || 20,
          canFeature: Boolean(data.canFeature) || Boolean(initial?.isFeatured),
        });
      })
      .catch(() => setFeaturedMeta({ count: 0, max: 20, canFeature: true }));
  }, [initial?.id, initial?.isFeatured]);

  const validate = (strict: boolean) => {
    const next: Errors = {};
    if (strict) {
      if (!form.images.length) next.photos = "Add at least one photo.";
      if (!form.title.trim()) next.title = "Required";
      if (!form.description.trim()) next.description = "Required";
      if (!form.propertyType) next.propertyType = "Required";
      if (!form.saleRent) next.saleRent = "Required";
      if (!form.priceNumber.trim()) next.priceNumber = "Required";
      if (!form.size.trim()) next.size = "Required";
      if (!form.bedrooms) next.bedrooms = "Required";
      if (!form.bathrooms) next.bathrooms = "Required";
      if (!form.kitchens) next.kitchens = "Required";
      if (!form.facing) next.facing = "Required";
      if (!form.totalFloors) next.totalFloors = "Required";
      if (!form.condition) next.condition = "Required";
      if (!form.society.trim() && !form.address.trim()) {
        next.society = "Society ya address zaroori hai";
        next.address = "Required";
      }
      if (!form.mapsLink.trim()) next.mapsLink = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (asDraft: boolean) => {
    if (!asDraft && !validate(true)) {
      setToast("Zaruri fields incomplete hain — red marks check karein.");
      window.setTimeout(() => {
        const firstError = document.querySelector(".border-red-400, .border-red-300");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    if (asDraft && !form.title.trim()) {
      setErrors({ title: "Draft needs at least a title." });
      setToast("Draft ke liye title likhein.");
      return;
    }

    setLoading(true);
    setToast("");
    try {
      const body = {
        title: form.title,
        description: form.description,
        saleRent: form.saleRent,
        buildStatus: form.buildStatus,
        propertyType: form.propertyType,
        priceNumber: form.priceNumber,
        size: form.size,
        bedrooms: form.bedrooms || "0",
        bathrooms: form.bathrooms || "0",
        kitchens: form.kitchens || "0",
        tvLounge: form.tvLounge || "0",
        carParking: form.carParking || "0",
        facing: form.facing,
        totalFloors: form.totalFloors,
        condition: form.condition,
        society: form.society,
        address: form.address || form.society,
        mapsLink: form.mapsLink,
        lat: form.lat,
        lng: form.lng,
        images: form.images,
        videos: form.videos,
        additionalInfo: form.additionalInfo,
        isDraft: asDraft,
        isFeatured: form.isFeatured,
      };

      const url =
        mode === "add"
          ? "/api/admin/properties"
          : `/api/admin/properties/${encodeURIComponent(initial?.id || initial?.slug || "")}`;
      const res = await fetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; property?: unknown };
      if (!res.ok) {
        setToast(data.error || `Save failed (${res.status})`);
        return;
      }
      setToast(asDraft ? "Draft saved" : mode === "edit" ? "Property updated" : "Property submitted");
      window.setTimeout(() => {
        window.location.assign(`${ADMIN_BASE}/dashboard`);
      }, 500);
    } catch {
      setToast("Unable to save property. Network / server error.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void save(false);
  };

  const heading = mode === "add" ? "Add New Property" : "Edit Property";
  const sub =
    mode === "add" ? "List Your Property. Reach More Buyers." : "Update property details and photos.";
  const submitLabel = mode === "add" ? "Submit Property" : "Update Property";

  return (
    <div className="min-h-screen bg-[#F3F6F4] pb-10">
      <header className="relative overflow-hidden bg-brand text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/images/listing-house-dusk.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 pt-3 pb-5">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={mode === "add" ? `${ADMIN_BASE}/add-property` : `${ADMIN_BASE}/dashboard`}
              className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
              <Image src="/logo-al-madina.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="truncate text-[10px] font-bold tracking-wide uppercase sm:text-xs">
                Al Madina Builders & Property Advisor
              </span>
            </div>
            <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded hover:bg-white/10" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
          <div className="mt-5 flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <Home className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{heading}</h1>
              <p className="mt-0.5 text-sm text-white/85">{sub}</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <PhotoUploadGrid
            images={form.images}
            onChange={(images) => set("images", images)}
            error={Boolean(errors.photos)}
          />
          {errors.photos ? <p className="mt-2 text-xs text-red-600">{errors.photos}</p> : null}
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <VideoUploadGrid videos={form.videos} onChange={(videos) => set("videos", videos)} />
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <FileText className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-ink sm:text-base">Basic Details</h2>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">
              Property Title<span className="text-red-500">*</span>
            </span>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. 5 Marla House for Sale in DHA Multan"
              className={cn(
                "h-11 w-full rounded border px-3 text-sm outline-none focus:border-primary",
                errors.title ? "border-red-400" : "border-line",
              )}
            />
          </label>
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-medium">
              Description<span className="text-red-500">*</span>
            </span>
            <textarea
              value={form.description}
              maxLength={DESC_MAX}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              placeholder="Write a detailed description about the property (features, location, etc)...."
              className={cn(
                "w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-primary",
                errors.description ? "border-red-400" : "border-line",
              )}
            />
            <p className="mt-1 text-right text-[11px] text-muted">
              {form.description.length}/{DESC_MAX}
            </p>
          </label>
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <ClipboardList className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-ink sm:text-base">Property Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CustomSelect
              label="Property Type"
              required
              optionsKey="propertyType"
              presetOptions={DEFAULT_SELECT_OPTIONS.propertyType}
              value={form.propertyType}
              onChange={(v) => set("propertyType", v)}
              error={Boolean(errors.propertyType)}
            />
            <CustomSelect
              label="Sale / Rent"
              required
              optionsKey="saleRent"
              presetOptions={DEFAULT_SELECT_OPTIONS.saleRent}
              value={form.saleRent}
              onChange={(v) => set("saleRent", v as SaleRent)}
              error={Boolean(errors.saleRent)}
            />
            <label className="block">
              <span className="mb-1 block text-xs font-medium">
                Price<span className="text-red-500">*</span>
              </span>
              <div
                className={cn(
                  "flex h-11 overflow-hidden rounded border",
                  errors.priceNumber ? "border-red-400" : "border-line",
                )}
              >
                <span className="flex items-center bg-mint px-3 text-xs font-bold text-brand">PKR</span>
                <input
                  inputMode="numeric"
                  value={form.priceNumber}
                  onChange={(e) => set("priceNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Price"
                  className="w-full px-3 text-sm outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">
                Size (Marla/Sq. Ft.)<span className="text-red-500">*</span>
              </span>
              <input
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                placeholder="e.g. 5 Marla"
                className={cn(
                  "h-11 w-full rounded border px-3 text-sm outline-none focus:border-primary",
                  errors.size ? "border-red-400" : "border-line",
                )}
              />
            </label>
            <CustomSelect
              label="Bedrooms"
              required
              optionsKey="bedrooms"
              presetOptions={DEFAULT_SELECT_OPTIONS.bedrooms}
              value={form.bedrooms}
              onChange={(v) => set("bedrooms", v)}
              placeholder="Select Bedrooms"
              error={Boolean(errors.bedrooms)}
            />
            <CustomSelect
              label="Bathrooms"
              required
              optionsKey="bathrooms"
              presetOptions={DEFAULT_SELECT_OPTIONS.bathrooms}
              value={form.bathrooms}
              onChange={(v) => set("bathrooms", v)}
              placeholder="Select Bathrooms"
              error={Boolean(errors.bathrooms)}
            />
            <CustomSelect
              label="Kitchens"
              required
              optionsKey="kitchens"
              presetOptions={DEFAULT_SELECT_OPTIONS.kitchens}
              value={form.kitchens}
              onChange={(v) => set("kitchens", v)}
              placeholder="Select Kitchens"
              error={Boolean(errors.kitchens)}
            />
            <CustomSelect
              label="TV Lounge"
              optionsKey="tvLounge"
              presetOptions={DEFAULT_SELECT_OPTIONS.tvLounge}
              value={form.tvLounge}
              onChange={(v) => set("tvLounge", v)}
              placeholder="Select TV Lounge"
            />
            <CustomSelect
              label="Car Parking"
              optionsKey="carParking"
              presetOptions={DEFAULT_SELECT_OPTIONS.carParking}
              value={form.carParking}
              onChange={(v) => set("carParking", v)}
              placeholder="Select Parking"
            />
            <CustomSelect
              label="Facing"
              required
              optionsKey="facing"
              presetOptions={DEFAULT_SELECT_OPTIONS.facing}
              value={form.facing}
              onChange={(v) => set("facing", v)}
              placeholder="Select Facing"
              error={Boolean(errors.facing)}
            />
            <CustomSelect
              label="Total Floors"
              required
              optionsKey="totalFloors"
              presetOptions={DEFAULT_SELECT_OPTIONS.totalFloors}
              value={form.totalFloors}
              onChange={(v) => set("totalFloors", v)}
              placeholder="Select Floors"
              error={Boolean(errors.totalFloors)}
            />
            <CustomSelect
              label="Condition"
              required
              optionsKey="condition"
              presetOptions={DEFAULT_SELECT_OPTIONS.condition}
              value={form.condition}
              onChange={(v) => set("condition", v)}
              placeholder="Select Condition"
              error={Boolean(errors.condition)}
            />
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <MapPin className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-ink sm:text-base">Location</h2>
          </div>

          <CustomSelect
            label="Society / Colony"
            required
            optionsKey="society"
            presetOptions={DEFAULT_SELECT_OPTIONS.society}
            value={form.society}
            onChange={(v) => set("society", v)}
            placeholder="Select Society"
            error={Boolean(errors.society)}
          />
          <label className="mt-3 block">
            <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-primary">
              <MapPin className="h-3.5 w-3.5" />
              Or Enter Manually
            </span>
            <textarea
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              rows={3}
              placeholder="Enter address (e.g. Street, Area, City)"
              className={cn(
                "w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-primary",
                errors.address ? "border-red-400" : "border-line",
              )}
            />
          </label>

          <div className="mt-4">
            <MapsLinkField
              value={form.mapsLink}
              lat={form.lat}
              lng={form.lng}
              error={Boolean(errors.mapsLink)}
              onChange={({ mapsLink, lat, lng }) => {
                set("mapsLink", mapsLink);
                set("lat", lat);
                set("lng", lng);
              }}
            />
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <PropertyStatusSelector value={form.buildStatus} onChange={(v) => set("buildStatus", v)} />
        </section>

        <section className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <StickyNote className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-ink sm:text-base">Additional Information (Optional)</h2>
              <p className="text-xs text-muted">
                You can add any extra details like installment plan, nearby landmarks, etc.
              </p>
            </div>
          </div>
          <textarea
            value={form.additionalInfo}
            onChange={(e) => set("additionalInfo", e.target.value)}
            rows={3}
            placeholder="Enter additional information..."
            className="mt-2 w-full rounded border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
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
                  Max {featuredMeta?.max ?? 20} featured listings (house + map). Currently{" "}
                  {featuredMeta?.count ?? "…"} / {featuredMeta?.max ?? 20}.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.isFeatured}
              disabled={
                !form.isFeatured && featuredMeta != null && !featuredMeta.canFeature && !initial?.isFeatured
              }
              onClick={() => {
                if (
                  !form.isFeatured &&
                  featuredMeta &&
                  !featuredMeta.canFeature &&
                  !initial?.isFeatured
                ) {
                  setToast(`Featured limit: max ${featuredMeta.max} hi allowed.`);
                  return;
                }
                set("isFeatured", !form.isFeatured);
              }}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                form.isFeatured ? "bg-primary" : "bg-line",
                !form.isFeatured && featuredMeta && !featuredMeta.canFeature && !initial?.isFeatured
                  ? "opacity-50"
                  : "",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                  form.isFeatured ? "translate-x-5" : "translate-x-0",
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
            {loading ? "Saving…" : submitLabel}
          </button>
        </div>

        <div className="flex items-start gap-2 rounded-md border border-[#CDE8D4] bg-[#EAF7EE] px-3 py-3 text-xs text-brand">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Your property will be reviewed by our team before it goes live.
        </div>
      </form>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
