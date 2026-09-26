"use client";

import { Search } from "lucide-react";
import {
  projectLocationOptions as defaultLocationOptions,
  projectStatusOptions,
  projectTypeOptions,
} from "@/data/projects";

type ConstructionSearchProps = {
  query: string;
  type: string;
  location: string;
  status: string;
  locations?: string[];
  onQuery: (value: string) => void;
  onType: (value: string) => void;
  onLocation: (value: string) => void;
  onStatus: (value: string) => void;
  onSubmit: () => void;
};

const fieldClass =
  "h-11 w-full rounded border border-line bg-white px-3 text-sm text-ink outline-none transition-all duration-200 focus:border-primary";

export function ConstructionSearch({
  query,
  type,
  location,
  status,
  locations,
  onQuery,
  onType,
  onLocation,
  onStatus,
  onSubmit,
}: ConstructionSearchProps) {
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
          placeholder="Search by project name, location or type..."
          className={`${fieldClass} pl-9`}
          aria-label="Search projects"
        />
      </label>
      <select value={type} onChange={(event) => onType(event.target.value)} className={fieldClass} aria-label="Project type">
        {projectTypeOptions.map((option) => (
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
      <select
        value={status}
        onChange={(event) => onStatus(event.target.value)}
        className={fieldClass}
        aria-label="Construction status"
      >
        {projectStatusOptions.map((option) => (
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
