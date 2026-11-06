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
  "h-10 w-full min-w-0 rounded border border-line bg-white px-2.5 text-xs text-ink outline-none transition-all duration-200 focus:border-primary sm:h-11 sm:px-3 sm:text-sm";

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
      {/*
        Mobile: ek horizontal line — saare filters (scroll se poore dikhen)
        Laptop (lg+): pehle jaisa ek row — search | type | location | price | button
      */}
      <div className="no-scrollbar flex items-stretch gap-2 overflow-x-auto pb-0.5 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:gap-3 lg:overflow-visible lg:pb-0">
        <label className="relative w-[11rem] shrink-0 sm:w-[13rem] lg:w-auto lg:min-w-0">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted sm:left-3 sm:h-4 sm:w-4"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by location, society..."
            className={`${fieldClass} pl-8 sm:pl-9`}
            aria-label="Search properties"
          />
        </label>

        <select
          value={type}
          onChange={(event) => onType(event.target.value)}
          className={`${fieldClass} w-[7.25rem] shrink-0 lg:w-full`}
          aria-label="Property type"
        >
          {propertyTypeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <select
          value={location}
          onChange={(event) => onLocation(event.target.value)}
          className={`${fieldClass} w-[8rem] shrink-0 lg:w-full`}
          aria-label="Location"
        >
          {locationChoices.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <select
          value={price}
          onChange={(event) => onPrice(event.target.value)}
          className={`${fieldClass} w-[8.25rem] shrink-0 lg:w-full`}
          aria-label="Price range"
        >
          {priceRangeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex h-10 w-auto shrink-0 items-center justify-center gap-1.5 rounded bg-primary px-4 text-xs font-semibold whitespace-nowrap text-white transition-all duration-200 hover:bg-primary-hover sm:h-11 sm:gap-2 sm:px-6 sm:text-sm lg:h-11 lg:w-full"
        >
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Search
        </button>
      </div>
    </form>
  );
}
