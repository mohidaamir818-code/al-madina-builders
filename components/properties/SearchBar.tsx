"use client";

import { Search } from "lucide-react";
import {
  locationOptions as defaultLocationOptions,
  priceRangeOptions,
  propertyTypeOptions,
} from "@/data/listings";

type SearchBarProps = {
  query: string;
  type: string;
  location: string;
  price: string;
  locations?: string[];
  onQuery: (value: string) => void;
  onType: (value: string) => void;
  onLocation: (value: string) => void;
  onPrice: (value: string) => void;
  onSubmit: () => void;
};

const fieldClass =
  "h-10 w-full rounded border border-line bg-white px-2.5 text-xs text-ink outline-none transition-all duration-200 focus:border-primary sm:h-11 sm:px-3 sm:text-sm lg:h-11";

export function SearchBar({
  query,
  type,
  location,
  price,
  locations,
  onQuery,
  onType,
  onLocation,
  onPrice,
  onSubmit,
}: SearchBarProps) {
  const locationChoices = locations?.length ? locations : [...defaultLocationOptions];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded border border-line bg-white p-2.5 shadow-sm sm:p-4"
    >
      {/* Search — full width */}
      <label className="relative block">
        <Search
          className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted sm:left-3 sm:h-4 sm:w-4"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search location, society..."
          className={`${fieldClass} pl-8 sm:pl-9`}
          aria-label="Search properties"
        />
      </label>

      {/* Mobile: horizontal scroll filters | Laptop: same row grid */}
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-0.5 lg:mt-3 lg:grid lg:grid-cols-[1fr_1fr_1fr_auto] lg:gap-3 lg:overflow-visible">
        <select
          value={type}
          onChange={(event) => onType(event.target.value)}
          className={`${fieldClass} w-[7.5rem] shrink-0 lg:w-full`}
          aria-label="Property type"
        >
          {propertyTypeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(event) => onLocation(event.target.value)}
          className={`${fieldClass} w-[8.5rem] shrink-0 lg:w-full`}
          aria-label="Location"
        >
          {locationChoices.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          value={price}
          onChange={(event) => onPrice(event.target.value)}
          className={`${fieldClass} w-[8.5rem] shrink-0 lg:w-full`}
          aria-label="Price range"
        >
          {priceRangeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded bg-primary px-4 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-hover sm:h-11 sm:gap-2 sm:px-6 sm:text-sm lg:h-11"
        >
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Search
        </button>
      </div>
    </form>
  );
}
