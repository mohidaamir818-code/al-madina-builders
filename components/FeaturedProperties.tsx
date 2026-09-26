"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Heart, MapPin, Maximize2 } from "lucide-react";
import type { Listing } from "@/data/listings";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

type FeaturedPropertiesProps = {
  listings: Listing[];
};

export function FeaturedProperties({ listings }: FeaturedPropertiesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (listings.length <= 1) return;

    const tick = () => {
      if (pausedRef.current) return;
      const el = scrollerRef.current;
      if (!el) return;
      const cards = Array.from(el.children) as HTMLElement[];
      if (cards.length === 0) return;

      indexRef.current = (indexRef.current + 1) % cards.length;
      const target = cards[indexRef.current];
      if (!target) return;

      el.scrollTo({
        left: target.offsetLeft - el.offsetLeft,
        behavior: "smooth",
      });
    };

    const id = window.setInterval(tick, 5000);
    return () => window.clearInterval(id);
  }, [listings.length]);

  return (
    <section id="properties" className="scroll-mt-24 bg-white py-14 lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            align="left"
            label="Featured Properties"
            title="Modern Homes for a Better Tomorrow"
            subtitle="Explore residential and rental properties listed by Al Madina Builders."
            className="max-w-2xl"
          />
          <Button href="/properties" className="shrink-0 self-start sm:self-auto">
            View All Properties
          </Button>
        </div>

        {listings.length === 0 ? (
          <p className="mt-10 rounded border border-dashed border-line bg-[#F3F6F4] px-4 py-10 text-center text-sm text-muted">
            Abhi koi featured property nahi hai. Admin se property add hone ke baad yahan dikhengi.
          </p>
        ) : (
          <div
            ref={scrollerRef}
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
            onTouchStart={() => {
              pausedRef.current = true;
            }}
            onTouchEnd={() => {
              window.setTimeout(() => {
                pausedRef.current = false;
              }, 4000);
            }}
            className="no-scrollbar mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-5 sm:px-0"
          >
            {listings.map((property) => {
              const href = property.href || `/properties/${property.slug}`;
              return (
                <article
                  key={`${property.type}-${property.slug}`}
                  className="w-[88%] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-md border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-[calc(50%-10px)] sm:max-w-none lg:w-[calc(25%-15px)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={property.image}
                      alt={`${property.title} in ${property.location}`}
                      fill
                      sizes="(max-width: 1023px) 82vw, 25vw"
                      className="object-cover"
                      unoptimized={property.image.startsWith("data:")}
                    />
                    <span className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm">
                      <Heart className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Save property</span>
                    </span>
                    <span className="absolute top-3 right-3 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                      {property.badge}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {property.location}
                    </p>
                    <p className="mt-2 flex items-center gap-3 text-sm font-medium text-ink">
                      <span className="inline-flex items-center gap-1">
                        <Maximize2 className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                        {property.area}
                      </span>
                      <span className="text-line">|</span>
                      <span>{property.type}</span>
                    </p>
                    <p className="mt-3 text-lg font-bold text-primary">{property.price}</p>
                    <Link
                      href={href}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded bg-primary text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
