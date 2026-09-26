"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { PAGE_SIZE, buildLocationOptions, propertyTypeOptions, type Listing } from "@/data/listings";
import { PROPERTIES_FILTER_KEY } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/properties/SearchBar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { HelpCard } from "@/components/properties/HelpCard";
import { Pagination } from "@/components/properties/Pagination";
import { cn } from "@/lib/cn";

function matchesPrice(listing: Listing, price: string) {
  if (price === "Any Price") return true;
  if (price === "Rentals") return listing.badge === "For Rent";
  if (listing.badge === "For Rent") return false;
  if (price === "Under PKR 50 Lakh") return listing.priceValue < 5000000;
  if (price === "PKR 50 Lakh – 2 Crore") return listing.priceValue >= 5000000 && listing.priceValue <= 20000000;
  if (price === "PKR 2 – 5 Crore") return listing.priceValue > 20000000 && listing.priceValue <= 50000000;
  if (price === "PKR 5 Crore+") return listing.priceValue > 50000000;
  return true;
}

function readStoredTypeFilter(): string {
  if (typeof window === "undefined") return "All Types";
  try {
    const raw = sessionStorage.getItem(PROPERTIES_FILTER_KEY);
    if (!raw) return "All Types";
    sessionStorage.removeItem(PROPERTIES_FILTER_KEY);
    const match = propertyTypeOptions.find((option) => option.toLowerCase() === raw.toLowerCase());
    return match || "All Types";
  } catch {
    return "All Types";
  }
}

type PropertiesBoardProps = {
  listings: Listing[];
};

export function PropertiesBoard({ listings }: PropertiesBoardProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [location, setLocation] = useState("All Locations");
  const [price, setPrice] = useState("Any Price");
  const [applied, setApplied] = useState({
    query: "",
    type: "All Types",
    location: "All Locations",
    price: "Any Price",
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);
  const [filterReady, setFilterReady] = useState(false);

  useEffect(() => {
    const stored = readStoredTypeFilter();
    if (stored !== "All Types") {
      setType(stored);
      setApplied((current) => ({ ...current, type: stored }));
      setPage(1);
    }
    setFilterReady(true);
  }, []);

  const locationChoices = useMemo(() => buildLocationOptions(listings), [listings]);
  const isRentalView = applied.type === "Rental";
  const isCommercialView = applied.type === "Commercial";

  const filtered = useMemo(() => {
    if (!filterReady) return [];
    const needle = applied.query.trim().toLowerCase();
    return listings.filter((item) => {
      const text = `${item.title} ${item.location} ${item.type} ${item.area}`.toLowerCase();
      const queryOk = !needle || text.includes(needle);
      const typeOk =
        applied.type === "All Types" ||
        item.type === applied.type ||
        (applied.type === "Rental" && item.badge === "For Rent");
      const locationOk =
        applied.location === "All Locations" ||
        item.location.toLowerCase().includes(applied.location.toLowerCase());
      const priceOk = matchesPrice(item, applied.price);
      return queryOk && typeOk && locationOk && priceOk;
    });
  }, [applied, listings, filterReady]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const applySearch = () => {
    setApplied({ query, type, location, price });
    setPage(1);
  };

  return (
    <div className="relative z-20 -mt-8 pb-16">
      <Container>
        <SearchBar
          query={query}
          type={type}
          location={location}
          price={price}
          locations={locationChoices}
          onQuery={setQuery}
          onType={(value) => {
            setType(value);
            setApplied((current) => ({ ...current, type: value }));
            setPage(1);
          }}
          onLocation={(value) => {
            setLocation(value);
            setApplied((current) => ({ ...current, location: value }));
            setPage(1);
          }}
          onPrice={(value) => {
            setPrice(value);
            setApplied((current) => ({ ...current, price: value }));
            setPage(1);
          }}
          onSubmit={applySearch}
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  {isRentalView
                    ? "Rental Properties"
                    : isCommercialView
                      ? "Commercial Properties"
                      : "Featured Properties"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
                  {isRentalView
                    ? "Properties for Rent"
                    : isCommercialView
                      ? "Commercial Properties"
                      : "Latest Properties for Sale & Rent"}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {isRentalView
                    ? "Browse all available rental homes and commercial units."
                    : isCommercialView
                      ? "Browse shops, offices and commercial listings."
                      : "Explore our handpicked residential, commercial and rental properties in top locations."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded border px-3 py-2 text-xs font-semibold",
                    view === "grid" ? "border-primary bg-primary text-white" : "border-line bg-white text-ink",
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Grid View
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded border px-3 py-2 text-xs font-semibold",
                    view === "list" ? "border-primary bg-primary text-white" : "border-line bg-white text-ink",
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                  List View
                </button>
              </div>
            </div>

            <div
              className={cn(
                "mt-6 grid gap-5",
                view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              )}
            >
              {visible.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  layout={view}
                  saved={saved.includes(listing.id)}
                  onToggleSave={(id) =>
                    setSaved((current) =>
                      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
                    )
                  }
                />
              ))}
            </div>

            {visible.length === 0 ? (
              <p className="mt-8 rounded border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
                {!filterReady
                  ? "Loading…"
                  : listings.length === 0
                    ? "Abhi koi property live nahi hai. Admin panel se pehli property add karein."
                    : isRentalView
                      ? "Abhi koi rental property nahi mili."
                      : isCommercialView
                        ? "Abhi koi commercial property nahi mili."
                        : "No properties match your search. Try another filter."}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Showing {filtered.length === 0 ? 0 : start + 1} – {Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} properties
              </p>
              <Pagination page={currentPage} totalPages={totalPages} onPage={setPage} />
            </div>
          </div>

          <div className="lg:pt-16">
            <HelpCard />
          </div>
        </div>
      </Container>
    </div>
  );
}
