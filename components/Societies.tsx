"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { societies } from "@/data/societies";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Societies() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: -1 | 1) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * 180, behavior: "smooth" });
  };

  return (
    <section id="societies" className="scroll-mt-24 bg-white py-14 lg:py-20">
      <Container>
        <SectionHeader
          label="Authorized Dealer / Property Partner"
          title="We Deal In All Major Housing Societies"
        />

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="absolute top-1/2 left-0 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-all duration-200 hover:border-primary hover:text-primary md:flex"
            aria-label="Previous societies"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="absolute top-1/2 right-0 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-all duration-200 hover:border-primary hover:text-primary md:flex"
            aria-label="Next societies"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scroller}
            className="no-scrollbar flex snap-x snap-mandatory justify-start gap-8 overflow-x-auto px-1 md:justify-center md:gap-12 md:overflow-visible md:px-4"
          >
            {societies.map((society) => (
              <article
                key={society.name}
                className="flex w-[42%] shrink-0 snap-start flex-col items-center text-center sm:w-[30%] md:w-40"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full border border-line bg-white shadow-sm sm:h-24 sm:w-24">
                  <Image
                    src={society.logo}
                    alt={`${society.name} logo`}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink">{society.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
