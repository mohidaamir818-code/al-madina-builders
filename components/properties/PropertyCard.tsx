"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import type { Listing } from "@/data/listings";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.23-1.63a11.9 11.9 0 0 0 5.82 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.42ZM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.7.97.99-3.6-.23-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.11 1.03 6.97 2.9a9.82 9.82 0 0 1 2.89 6.97c0 5.44-4.43 9.83-9.9 9.83Zm5.42-7.38c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

type PropertyCardProps = {
  listing: Listing;
  layout?: "grid" | "list";
  saved: boolean;
  onToggleSave: (id: string) => void;
};

export function PropertyCard({ listing, layout = "grid", saved, onToggleSave }: PropertyCardProps) {
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Assalamualaikum, I am interested in ${listing.title} (${listing.location}) listed at ${listing.price}.`,
  )}`;

  return (
    <article
      className={cn(
        "overflow-hidden rounded border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        layout === "list" && "sm:flex",
      )}
    >
      <div className={cn("relative aspect-[4/3]", layout === "list" && "sm:w-[42%] sm:shrink-0")}>
        <Image
          src={listing.image}
          alt={`${listing.title} in ${listing.location}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <span
          className={cn(
            "absolute top-3 left-3 rounded px-2.5 py-1 text-[11px] font-semibold text-white",
            listing.badge === "For Rent" ? "bg-orange-500" : "bg-primary",
          )}
        >
          {listing.badge}
        </span>
        <button
          type="button"
          onClick={() => onToggleSave(listing.id)}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm"
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-ink">{listing.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {listing.location}
        </p>
        <ul className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
          <li className="inline-flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {listing.area}
          </li>
          {listing.beds ? (
            <li className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {listing.beds} Beds
            </li>
          ) : null}
          {listing.baths ? (
            <li className="inline-flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {listing.baths} Baths
            </li>
          ) : null}
          {listing.units ? (
            <li className="inline-flex items-center gap-1">{listing.units} Units</li>
          ) : null}
        </ul>
        <p className="mt-3 text-lg font-bold text-primary">{listing.price}</p>
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/properties/${listing.slug}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded bg-primary text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover"
          >
            View Details →
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp inquiry for ${listing.title}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all duration-200 hover:bg-primary-hover"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </article>
  );
}
