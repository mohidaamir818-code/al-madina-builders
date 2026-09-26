"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type PropertyGalleryProps = {
  images: string[];
  title: string;
  status: "For Sale" | "For Rent";
};

export function PropertyGallery({ images, title, status }: PropertyGalleryProps) {
  const photos = useMemo(() => (images.length ? images : ["/images/listing-house-dusk.jpg"]), [images]);
  const [index, setIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  const visibleThumbs = photos.slice(thumbStart, thumbStart + 4);
  const hasMore = photos.length > thumbStart + 4;

  const go = (next: number) => {
    const wrapped = (next + photos.length) % photos.length;
    setIndex(wrapped);
    if (wrapped < thumbStart) setThumbStart(wrapped);
    if (wrapped >= thumbStart + 4) setThumbStart(Math.max(0, wrapped - 3));
  };

  return (
    <div className="overflow-hidden rounded border border-line bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-mint sm:aspect-[16/9]">
        <Image
          src={photos[index]}
          alt={`${title} – image ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 66vw"
          className="object-cover"
        />

        <span
          className={cn(
            "absolute top-3 left-3 rounded px-2.5 py-1 text-[11px] font-semibold text-white",
            status === "For Rent" ? "bg-orange-500" : "bg-primary",
          )}
        >
          {status}
        </span>

        <span className="absolute top-3 right-3 rounded bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white">
          {index + 1}/{photos.length}
        </span>

        <button
          type="button"
          onClick={() => go(index - 1)}
          className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded bg-white/90 text-ink shadow-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded bg-white/90 text-ink shadow-sm"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-t border-line bg-white p-2.5">
        {visibleThumbs.map((src, i) => {
          const realIndex = thumbStart + i;
          return (
            <button
              key={`${src}-${realIndex}`}
              type="button"
              onClick={() => setIndex(realIndex)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded border-2 sm:h-[72px] sm:w-24",
                realIndex === index ? "border-primary" : "border-transparent opacity-90",
              )}
              aria-label={`Show image ${realIndex + 1}`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          );
        })}
        {hasMore ? (
          <button
            type="button"
            onClick={() => setThumbStart((s) => Math.min(s + 1, photos.length - 4))}
            className="flex h-16 w-12 shrink-0 items-center justify-center rounded border border-line bg-mint text-primary sm:h-[72px]"
            aria-label="More images"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
