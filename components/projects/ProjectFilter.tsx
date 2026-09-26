"use client";

import { Search } from "lucide-react";
import {
  projectLocationFilterOptions,
  projectPriceFilterOptions,
  projectTypeFilterOptions,
} from "@/data/showcaseProjects";

type ProjectFilterProps = {
  type: string;
  location: string;
  price: string;
  onType: (value: string) => void;
  onLocation: (value: string) => void;
  onPrice: (value: string) => void;
  onSubmit: () => void;
};

const fieldClass =
  "h-11 w-full rounded border border-line bg-white px-3 text-sm text-ink outline-none focus:border-primary";

export function ProjectFilter({
  type,
  location,
  price,
  onType,
  onLocation,
  onPrice,
  onSubmit,
}: ProjectFilterProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-1 gap-3 rounded border border-line bg-white p-4 shadow-sm sm:p-5 lg:grid-cols-4"
    >
      <select value={type} onChange={(event) => onType(event.target.value)} className={fieldClass} aria-label="Project type">
        {projectTypeFilterOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select
        value={location}
        onChange={(event) => onLocation(event.target.value)}
        className={fieldClass}
        aria-label="Location"
      >
        {projectLocationFilterOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select value={price} onChange={(event) => onPrice(event.target.value)} className={fieldClass} aria-label="Price range">
        {projectPriceFilterOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#0B3B1E] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#072816]"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Search Projects
      </button>
    </form>
  );
}
