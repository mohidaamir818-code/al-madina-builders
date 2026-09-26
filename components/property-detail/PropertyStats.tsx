import {
  Bath,
  BedDouble,
  Car,
  CookingPot,
  Maximize2,
  Sofa,
  Store,
  Building2,
} from "lucide-react";
import type { PropertyStat } from "@/data/propertyDetails";
import { cn } from "@/lib/cn";

const iconMap = {
  bed: BedDouble,
  bath: Bath,
  kitchen: CookingPot,
  lounge: Sofa,
  parking: Car,
  area: Maximize2,
  shop: Store,
  unit: Building2,
} as const;

type PropertyStatsProps = {
  stats: PropertyStat[];
  className?: string;
};

export function PropertyStats({ stats, className }: PropertyStatsProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-5 gap-1 rounded border border-[#CDE8D4] bg-[#EAF7EE] p-3 sm:gap-2 sm:p-4",
        className,
      )}
    >
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <li key={stat.key} className="flex flex-col items-center gap-1 text-center">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-ink sm:text-base">{stat.value}</span>
            <span className="text-[10px] leading-tight text-muted sm:text-xs">{stat.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
