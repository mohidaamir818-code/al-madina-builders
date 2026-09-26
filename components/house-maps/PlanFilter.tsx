"use client";

import { BedDouble, Building2, Home, Maximize2, Search } from "lucide-react";
import { areaOptions, bedOptions, floorOptions } from "@/data/housePlans";

type PlanFilterProps = {
  beds: string;
  area: string;
  floors: string;
  onBeds: (value: string) => void;
  onArea: (value: string) => void;
  onFloors: (value: string) => void;
  onSubmit: () => void;
};

const fieldClass =
  "h-11 w-full rounded border border-line bg-white py-2 pr-3 pl-9 text-sm text-ink outline-none focus:border-primary";

export function PlanFilter({ beds, area, floors, onBeds, onArea, onFloors, onSubmit }: PlanFilterProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded border border-line bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Home className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-ink">Find Your Perfect House Plan</h2>
          <p className="mt-1 text-sm text-muted">
            Browse through our available house plans and choose the one that fits your needs.
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
        <label className="relative">
          <BedDouble className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
          <select value={beds} onChange={(event) => onBeds(event.target.value)} className={fieldClass} aria-label="Beds">
            {bedOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="relative">
          <Maximize2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
          <select value={area} onChange={(event) => onArea(event.target.value)} className={fieldClass} aria-label="Area">
            {areaOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="relative">
          <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
          <select value={floors} onChange={(event) => onFloors(event.target.value)} className={fieldClass} aria-label="Floors">
            {floorOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#0B3B1E] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#072816]"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search Plans
        </button>
      </div>
    </form>
  );
}
