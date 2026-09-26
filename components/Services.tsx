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

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
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
                className="group flex h-full flex-col rounded-md border border-line bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-12 sm:w-12">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all duration-200 group-hover:bg-primary-hover sm:h-8 sm:w-8">
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-3 text-sm leading-snug font-semibold text-ink sm:mt-4 sm:text-base">
                  {service.title}
                </h3>
                <p className="mt-1.5 hidden text-sm leading-6 text-muted sm:mt-2 sm:block">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
