"use client";

import { CheckCircle2, Circle, Construction, Home, PauseCircle, Building2 } from "lucide-react";
import type { BuildStatus } from "@/data/adminProperties";
import { cn } from "@/lib/cn";

const OPTIONS: Array<{
  value: BuildStatus;
  title: string;
  sub: string;
  icon: typeof Construction;
}> = [
  {
    value: "In Progress",
    title: "In Progress",
    sub: "Construction/Development is in progress",
    icon: Construction,
  },
  {
    value: "Grey Structure",
    title: "Grey Structure",
    sub: "Structure completed, finishing pending",
    icon: Building2,
  },
  {
    value: "Completed",
    title: "Completed",
    sub: "Ready to Move",
    icon: Home,
  },
  {
    value: "On Hold",
    title: "On Hold",
    sub: "Work temporarily stopped",
    icon: PauseCircle,
  },
];

type PropertyStatusSelectorProps = {
  value: BuildStatus;
  onChange: (value: BuildStatus) => void;
};

export function PropertyStatusSelector({ value, onChange }: PropertyStatusSelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-ink sm:text-base">Property Status</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative rounded border p-3 text-left transition-colors",
                selected
                  ? "border-primary bg-[#EAF7EE] shadow-sm"
                  : "border-line bg-white hover:border-primary/40",
              )}
            >
              <span className="absolute top-2 right-2">
                {selected ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-line" />
                )}
              </span>
              <Icon className={cn("h-5 w-5", selected ? "text-primary" : "text-muted")} />
              <p className="mt-2 text-sm font-bold text-ink">{opt.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">{opt.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
