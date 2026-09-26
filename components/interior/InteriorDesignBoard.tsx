"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Armchair,
  Bath,
  BedDouble,
  Briefcase,
  ChefHat,
  ChevronDown,
  Filter,
  Heart,
  Home,
  MessageSquareText,
  PenTool,
  Search,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import {
  interiorCategories,
  interiorConsultMessage,
  type InteriorCategory,
  type InteriorDesign,
} from "@/data/interiorDesigns";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const categoryIcons: Record<string, LucideIcon> = {
  sofa: Armchair,
  bed: BedDouble,
  chef: ChefHat,
  bath: Bath,
  utensils: UtensilsCrossed,
  briefcase: Briefcase,
  home: Home,
};

const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(interiorConsultMessage)}`;

function DesignCard({
  design,
  saved,
  onToggleSave,
}: {
  design: InteriorDesign;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[10px] border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3]">
        <Image
          src={design.image}
          alt={design.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => onToggleSave(design.id)}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm"
          aria-label={saved ? "Remove from saved" : "Save design"}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
        </button>
      </div>
      <div className="space-y-2 p-3.5 sm:p-4">
        <h3 className="text-sm font-bold text-ink sm:text-base">{design.title}</h3>
        <p className="line-clamp-3 text-xs leading-5 text-muted">{design.description}</p>
        <Link
          href={`/interior-design/${design.id}`}
          className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-[10px] bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}

type InteriorDesignBoardProps = {
  designs: InteriorDesign[];
};

export function InteriorDesignBoard({ designs }: InteriorDesignBoardProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<InteriorCategory | "All">("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return designs.filter((item) => {
      const categoryOk = category === "All" || item.category === category;
      const text = `${item.title} ${item.category} ${item.location} ${item.description}`.toLowerCase();
      const queryOk = !needle || text.includes(needle);
      return categoryOk && queryOk;
    });
  }, [query, category, designs]);

  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div className="pb-16">
      <Container className="pt-4 sm:pt-6">
        {/* Search + Filters */}
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by style, designer, or keyword..."
              className="h-11 w-full rounded-[10px] border border-line bg-white pr-3 pl-9 text-sm outline-none focus:border-primary"
              aria-label="Search interior designs"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[10px] border border-line bg-white px-3 text-sm font-semibold text-ink"
          >
            <Filter className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", filtersOpen && "rotate-180")} />
          </button>
        </div>

        {filtersOpen ? (
          <div className="mt-3 flex flex-wrap gap-2 rounded-[10px] border border-line bg-white p-3">
            <button
              type="button"
              onClick={() => setCategory("All")}
              className={cn(
                "rounded-[8px] px-3 py-1.5 text-xs font-semibold",
                category === "All" ? "bg-brand text-white" : "bg-mint text-ink",
              )}
            >
              All
            </button>
            {interiorCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id as InteriorCategory)}
                className={cn(
                  "rounded-[8px] px-3 py-1.5 text-xs font-semibold",
                  category === item.id ? "bg-brand text-white" : "bg-mint text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Room categories */}
        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
          {interiorCategories.map((item) => {
            const Icon = categoryIcons[item.icon] || Home;
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(active ? "All" : (item.id as InteriorCategory))}
                className="flex w-[88px] shrink-0 flex-col items-center gap-2 sm:w-auto"
              >
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-[10px] transition-colors sm:h-[72px] sm:w-full sm:max-w-[88px]",
                    active ? "bg-brand text-white" : "bg-[#E8F5EC] text-brand",
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </span>
                <span className={cn("text-center text-[11px] font-semibold", active ? "text-brand" : "text-ink")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured grid */}
        <section id="featured-designs" className="mt-8 scroll-mt-24">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">Featured Interior Designs</h2>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="shrink-0 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              {showAll ? "Show Less" : "View All →"}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                saved={saved.includes(design.id)}
                onToggleSave={(id) =>
                  setSaved((current) =>
                    current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
                  )
                }
              />
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="mt-8 rounded-[10px] border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
              {designs.length === 0
                ? "Abhi koi interior design live nahi hai. Admin panel se pehla design add karein."
                : "No designs match your search. Try another style or category."}
            </p>
          ) : null}
        </section>

        {/* Custom design CTA */}
        <section className="mt-8 overflow-hidden rounded-[10px] border border-[#CDE8D4] bg-[#EAF7EE]">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white text-brand shadow-sm">
                <PenTool className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-ink">Need a Custom Design?</h3>
                <p className="mt-1 text-sm text-muted">
                  Get personalized interior design plans from our expert designers.
                </p>
              </div>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep"
            >
              <MessageSquareText className="h-4 w-4" />
              Contact Designer →
            </a>
          </div>
        </section>
      </Container>
    </div>
  );
}
