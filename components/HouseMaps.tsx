import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Maximize2 } from "lucide-react";
import type { AdminHouseMap } from "@/lib/admin/houseMapStore";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

type HouseMapsProps = {
  maps: AdminHouseMap[];
};

export function HouseMaps({ maps }: HouseMapsProps) {
  return (
    <section id="house-maps" className="scroll-mt-24 bg-white py-14 lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            align="left"
            label="Professional House Maps"
            title="Smart Layouts, Beautiful Designs"
            subtitle="Construction-ready maps for 3 Marla to 1 Kanal homes, designed around light, flow and family living."
            className="max-w-2xl"
          />
          <Button href="/house-maps" className="shrink-0 self-start sm:self-auto">
            View All Maps
          </Button>
        </div>

        {maps.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            House maps will appear here once published from the admin panel.
          </p>
        ) : (
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {maps.map((map) => (
              <article
                key={map.id}
                className="w-[82%] shrink-0 snap-start overflow-hidden rounded-md border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-auto"
              >
                <Link href={`/house-maps/${map.slug}`} className="relative block aspect-[4/3]">
                  <Image
                    src={map.image || "/images/floorplan-5marla.jpg"}
                    alt={`${map.title} design preview`}
                    fill
                    sizes="(max-width: 1023px) 82vw, 25vw"
                    className="object-cover"
                  />
                  {map.badge ? (
                    <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-ink shadow-sm">
                      {map.badge}
                    </span>
                  ) : null}
                </Link>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-ink">
                    <Link href={`/house-maps/${map.slug}`} className="hover:text-primary">
                      {map.title}
                    </Link>
                  </h3>
                  <ul className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <li className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {map.beds} Beds
                    </li>
                    <li className="inline-flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {map.baths} Bath
                    </li>
                    {map.sqft > 0 ? (
                      <li className="inline-flex items-center gap-1">
                        <Maximize2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {map.sqft.toLocaleString()} sqft
                      </li>
                    ) : null}
                  </ul>
                  <p className="mt-3 text-lg font-bold text-primary">{map.price}</p>
                  <Button href={`/house-maps/${map.slug}`} className="mt-4 w-full">
                    View Details
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
