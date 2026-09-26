"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Armchair, Home, Map } from "lucide-react";
import { ADMIN_BASE } from "@/lib/admin/constants";

const OPTIONS = [
  {
    href: `${ADMIN_BASE}/add-property/house`,
    title: "House / Property",
    description: "Sale or rent listing — full property details, photos, videos and map link.",
    icon: Home,
    tone: "bg-[#EAF7EE] text-brand",
  },
  {
    href: `${ADMIN_BASE}/add-property/map`,
    title: "House Map / Plan",
    description: "Floor plans with photos, beds, baths, area and package price for House Maps page.",
    icon: Map,
    tone: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    href: `${ADMIN_BASE}/add-property/interior`,
    title: "Interior Design",
    description: "Interior packages with room photos, style, location and design pricing.",
    icon: Armchair,
    tone: "bg-[#FEF3C7] text-[#B45309]",
  },
] as const;

export function ListingTypeChooser() {
  return (
    <div className="min-h-screen bg-[#F3F6F4] pb-10">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link
            href={`${ADMIN_BASE}/dashboard`}
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
          <span className="w-9" />
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-6">
          <h1 className="text-xl font-bold sm:text-2xl">What are you listing?</h1>
          <p className="mt-1 text-sm text-white/85">Choose a listing type to continue.</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-3 px-4 py-5">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <Link
              key={opt.href}
              href={opt.href}
              className="flex items-start gap-4 rounded-md border border-line bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${opt.tone}`}>
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-ink">{opt.title}</p>
                <p className="mt-1 text-sm leading-5 text-muted">{opt.description}</p>
                <p className="mt-2 text-sm font-semibold text-primary">Continue →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
