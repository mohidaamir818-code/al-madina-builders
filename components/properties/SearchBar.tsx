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
  "h-11 w-full rounded border border-line bg-white px-3 text-sm text-ink outline-none transition-all duration-200 focus:border-primary";

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
      className="grid grid-cols-1 gap-3 rounded border border-line bg-white p-3 shadow-sm sm:p-4 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
    >
      <label className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search by location, society or property type..."
          className={`${fieldClass} pl-9`}
          aria-label="Search properties"
        />
      </label>
      <select value={type} onChange={(event) => onType(event.target.value)} className={fieldClass} aria-label="Property type">
        {propertyTypeOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select
        value={location}
        onChange={(event) => onLocation(event.target.value)}
        className={fieldClass}
        aria-label="Location"
      >
        {locationChoices.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select value={price} onChange={(event) => onPrice(event.target.value)} className={fieldClass} aria-label="Price range">
        {priceRangeOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded bg-primary px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
