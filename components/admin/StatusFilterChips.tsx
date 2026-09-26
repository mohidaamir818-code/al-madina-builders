"use client";

import { cn } from "@/lib/cn";

export type StatusFilter = "All" | "For Sale" | "For Rent" | "In Progress" | "Completed";

type StatusFilterChipsProps = {
  active: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
};

const ORDER: StatusFilter[] = ["All", "For Sale", "For Rent", "In Progress", "Completed"];

export function StatusFilterChips({ active, counts, onChange }: StatusFilterChipsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {ORDER.map((status) => {
        const isActive = active === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-brand text-white"
                : "border border-[#CDE8D4] bg-[#EAF7EE] text-brand",
            )}
          >
            {status} ({counts[status] ?? 0})
          </button>
        );
      })}
    </div>
  );
}
