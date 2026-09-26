"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BellRing, ChevronDown, Filter, Home, ImagePlus, Plus, Search, Star } from "lucide-react";
import type { AdminProperty } from "@/data/adminProperties";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { AdminShell } from "@/components/admin/AdminShell";
import { PropertyListCard } from "@/components/admin/PropertyListCard";
import { StatusFilterChips, type StatusFilter } from "@/components/admin/StatusFilterChips";

type AdminDashboardPageProps = {
  initialProperties: AdminProperty[];
};

export function AdminDashboardPage({ initialProperties }: AdminDashboardPageProps) {
  const [properties, setProperties] = useState(initialProperties);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const counts = useMemo(() => {
    const live = properties.filter((p) => !p.isDraft);
    const base = {
      All: live.length,
      "For Sale": 0,
      "For Rent": 0,
      "In Progress": 0,
      Completed: 0,
    } as Record<StatusFilter, number>;
    for (const p of live) {
      if (p.saleRent === "For Sale") base["For Sale"] += 1;
      if (p.saleRent === "For Rent") base["For Rent"] += 1;
      if (
        p.buildStatus === "In Progress" ||
        p.buildStatus === "Grey Structure" ||
        p.buildStatus === "On Hold"
      ) {
        base["In Progress"] += 1;
      }
      if (p.buildStatus === "Completed") base.Completed += 1;
    }
    return base;
  }, [properties]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (p.isDraft) return false;
      let statusOk = status === "All";
      if (status === "For Sale") statusOk = p.saleRent === "For Sale";
      if (status === "For Rent") statusOk = p.saleRent === "For Rent";
      if (status === "In Progress") {
        statusOk =
          p.buildStatus === "In Progress" ||
          p.buildStatus === "Grey Structure" ||
          p.buildStatus === "On Hold";
      }
      if (status === "Completed") statusOk = p.buildStatus === "Completed";
      const text = `${p.title} ${p.location}`.toLowerCase();
      const queryOk = !needle || text.includes(needle);
      return statusOk && queryOk;
    });
  }, [properties, query, status]);

  return (
    <AdminShell>
      <div className="space-y-4 px-4 py-4">
        <Link
          href={`${ADMIN_BASE}/add-property`}
          className="relative flex items-center gap-3 overflow-hidden rounded-md bg-primary px-4 py-4 text-white shadow-sm"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary">
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold">Add New Listing →</p>
            <p className="text-xs text-white/90">House, map or interior design</p>
          </div>
          <Home className="absolute right-3 bottom-2 h-16 w-16 text-white/20" aria-hidden="true" />
        </Link>

        <Link
          href={`${ADMIN_BASE}/dashboard/banners`}
          className="flex items-center gap-3 rounded-md border border-line bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-mint"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7EE] text-primary">
            <ImagePlus className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">Manage Banners →</p>
            <p className="text-xs text-muted">Har page ka banner, size tips aur buttons</p>
          </div>
        </Link>

        <Link
          href={`${ADMIN_BASE}/dashboard/reviews`}
          className="flex items-center gap-3 rounded-md border border-line bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-mint"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7EE] text-primary">
            <Star className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">Approve Reviews →</p>
            <p className="text-xs text-muted">Naye reviews approve / delete karein</p>
          </div>
        </Link>

        <Link
          href={`${ADMIN_BASE}/dashboard/deal-alerts`}
          className="flex items-center gap-3 rounded-md border border-line bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-mint"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7EE] text-primary">
            <BellRing className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">Deal Alert Subscribers →</p>
            <p className="text-xs text-muted">Registered emails aur WhatsApp numbers</p>
          </div>
        </Link>

        <div className="flex gap-2">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by property name, location, or city..."
              className="h-11 w-full rounded-md border border-line bg-white pr-3 pl-9 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex h-11 items-center gap-1.5 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink"
          >
            <Filter className="h-4 w-4 text-primary" />
            Filters
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>
        </div>

        {filtersOpen ? (
          <p className="rounded-md border border-line bg-white px-3 py-2 text-xs text-muted">
            Use status chips below to filter. Search matches title, location, and city.
          </p>
        ) : null}

        <StatusFilterChips active={status} counts={counts} onChange={setStatus} />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((property) => (
            <PropertyListCard
              key={property.id}
              property={property}
              onDeleted={(id) => setProperties((list) => list.filter((p) => p.id !== id))}
            />
          ))}
        </div>

        {!filtered.length ? (
          <p className="rounded-md border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
            No properties match your search.
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}
