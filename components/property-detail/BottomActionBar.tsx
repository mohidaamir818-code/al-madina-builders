"use client";

import { CalendarDays, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

type BottomActionBarProps = {
  callNumber: string;
  callDisplay: string;
  onSchedule: () => void;
  className?: string;
};

export function BottomActionBar({ callNumber, callDisplay, onSchedule, className }: BottomActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-brand-deep bg-brand px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.15)]",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2 sm:gap-3">
        <a
          href={`tel:${callNumber}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded bg-white px-3 text-sm font-semibold text-brand"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">Call Now · {callDisplay}</span>
        </a>
        <button
          type="button"
          onClick={onSchedule}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-semibold text-white hover:bg-primary-hover sm:flex-none sm:px-6"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Schedule a Visit
        </button>
      </div>
    </div>
  );
}
