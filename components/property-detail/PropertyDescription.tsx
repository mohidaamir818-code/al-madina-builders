"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { cn } from "@/lib/cn";

type PropertyDescriptionProps = {
  text: string;
  className?: string;
  collapseAt?: number;
};

export function PropertyDescription({ text, className, collapseAt = 180 }: PropertyDescriptionProps) {
  const [open, setOpen] = useState(false);
  const needsToggle = text.length > collapseAt;
  const shown = !needsToggle || open ? text : `${text.slice(0, collapseAt).trim()}…`;

  return (
    <section className={cn("rounded border border-line bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
          <FileText className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-bold text-ink sm:text-lg">Description</h2>
      </div>
      <p className="text-sm leading-7 text-muted">{shown}</p>
      {needsToggle ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          {open ? (
            <>
              Read Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      ) : null}
    </section>
  );
}
