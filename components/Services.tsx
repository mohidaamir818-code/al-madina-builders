"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  HardHat,
  Home,
  KeyRound,
  Map,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import { PROPERTIES_FILTER_KEY, services, type ServiceIcon } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<ServiceIcon, LucideIcon> = {
  home: Home,
  map: Map,
  construction: HardHat,
  interior: Sofa,
  commercial: Building2,
  rental: KeyRound,
};

export function Services() {
  return (
    <section className="bg-mint py-14 lg:py-20">
      <Container>
        <SectionHeader
          label="Our Services"
          title="Complete Real Estate & Construction Solutions"
          subtitle="From buying a plot to designing the map and delivering the finished home — one trusted team in Multan."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            const filterType = "filterType" in service ? service.filterType : undefined;
            return (
              <Link
                key={service.title}
                href={service.href}
                onClick={() => {
                  if (typeof window === "undefined") return;
                  if (filterType) {
                    sessionStorage.setItem(PROPERTIES_FILTER_KEY, filterType);
                  } else if (service.href === "/properties") {
                    sessionStorage.removeItem(PROPERTIES_FILTER_KEY);
                  }
                }}
                className="group relative block rounded-md border border-line bg-white p-5 pb-12 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="pr-6">
                    <h3 className="text-base font-semibold text-ink">{service.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{service.description}</p>
                  </div>
                </div>
                <span className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-all duration-200 group-hover:bg-primary-hover">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
