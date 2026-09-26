"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Eye, MapPin, Maximize2, Pencil, Trash2 } from "lucide-react";
import type { AdminProperty } from "@/data/adminProperties";
import { ADMIN_STATUS_COLORS } from "@/data/adminProperties";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { cn } from "@/lib/cn";

type PropertyListCardProps = {
  property: AdminProperty;
  onDeleted: (id: string) => void;
};

export function PropertyListCard({ property, onDeleted }: PropertyListCardProps) {
  const listStatus = property.status;
  const colors = ADMIN_STATUS_COLORS[listStatus] || ADMIN_STATUS_COLORS["For Sale"];
  const badgeLabel = property.saleRent === "For Rent" ? "For Rent" : property.buildStatus === "In Progress" || property.buildStatus === "Grey Structure" || property.buildStatus === "On Hold" ? property.buildStatus : property.saleRent;

  const onDelete = async () => {
    if (!window.confirm(`Delete “${property.title}”? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/properties/${property.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(property.id);
    else window.alert("Could not delete property.");
  };

  const onView = () => {
    window.open(`/properties/${property.publicSlug || property.slug}`, "_blank");
  };

  return (
    <article className="flex gap-3 rounded-md border border-line bg-white p-3 shadow-sm">
      <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-md sm:h-28 sm:w-28">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="112px"
          className="object-cover"
          unoptimized={property.image.startsWith("data:")}
        />
        <span
          className={cn(
            "absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[9px] font-semibold text-white",
            colors.badge,
          )}
        >
          {badgeLabel}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-ink sm:text-base">{property.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              <span className="truncate">{property.location}</span>
            </p>
            <p className="mt-1 text-sm font-bold text-primary">{property.priceDisplay || property.price}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                colors.pill,
                colors.pillText,
              )}
            >
              {property.buildStatus || property.status}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onView}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm"
                aria-label="View"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <Link
                href={`${ADMIN_BASE}/edit-property/${property.slug}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm"
                aria-label="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={onDelete}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-red-600 shadow-sm"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <ul className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted">
          <li className="inline-flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5 text-primary" />
            {property.beds} Beds
          </li>
          <li className="inline-flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-primary" />
            {property.baths} Baths
          </li>
          <li className="inline-flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-primary" />
            {property.area}
          </li>
        </ul>
        <p className="mt-1.5 line-clamp-1 text-[11px] text-muted">{property.description}</p>
      </div>
    </article>
  );
}
