"use client";

import { useState } from "react";
import { Crosshair, LocateFixed, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type PropertyMapSectionProps = {
  title: string;
  address: string;
  lat: number;
  lng: number;
  /** Original Google Maps link from admin — used for Get Directions */
  mapsLink?: string;
  className?: string;
};

export function PropertyMapSection({
  title,
  address,
  lat,
  lng,
  mapsLink,
  className,
}: PropertyMapSectionProps) {
  const [tab, setTab] = useState<"map" | "street">("map");
  const [zoom, setZoom] = useState(16);

  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;
  const directionsUrl =
    mapsLink?.trim() ||
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section className={cn("rounded border border-line bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("map")}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-semibold transition-colors",
            tab === "map" ? "bg-primary text-white" : "border border-primary text-primary",
          )}
        >
          Location Map
        </button>
        <button
          type="button"
          onClick={() => setTab("street")}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-semibold transition-colors",
            tab === "street" ? "bg-primary text-white" : "border border-primary text-primary",
          )}
        >
          Street View
        </button>
      </div>

      <div className="relative overflow-hidden rounded border border-line">
        {tab === "map" ? (
          <>
            <iframe
              title={`Map of ${title}`}
              src={mapSrc}
              className="h-56 w-full sm:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="absolute top-3 right-3 rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              Live Location
            </span>
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 1, 20))}
                className="flex h-8 w-8 items-center justify-center rounded bg-white text-ink shadow-sm"
                aria-label="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 1, 10))}
                className="flex h-8 w-8 items-center justify-center rounded bg-white text-ink shadow-sm"
                aria-label="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </button>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded bg-white text-ink shadow-sm"
                aria-label="Open in Google Maps"
              >
                <LocateFixed className="h-4 w-4" />
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-none flex -translate-y-6 flex-col items-center">
                <span className="mb-1 max-w-[180px] truncate rounded bg-brand px-2 py-1 text-[10px] font-semibold text-white shadow">
                  {title}
                </span>
                <Crosshair className="h-7 w-7 text-primary drop-shadow" aria-hidden="true" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center gap-2 bg-mint px-4 text-center sm:h-72">
            <p className="text-sm font-semibold text-ink">Street View coming soon</p>
            <p className="text-xs text-muted">We will embed Google Street View for this property shortly.</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{address}</p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}
