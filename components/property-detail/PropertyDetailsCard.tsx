import { ClipboardList } from "lucide-react";
import type { PropertyDetailFields } from "@/data/propertyDetails";
import { cn } from "@/lib/cn";

type PropertyDetailsCardProps = {
  details: PropertyDetailFields;
  className?: string;
};

const leftKeys: Array<keyof PropertyDetailFields> = [
  "propertyType",
  "size",
  "facing",
  "totalFloors",
  "condition",
];
const rightKeys: Array<keyof PropertyDetailFields> = [
  "location",
  "price",
  "availability",
  "possession",
  "installment",
];

const labels: Record<keyof PropertyDetailFields, string> = {
  propertyType: "Property Type",
  size: "Size",
  facing: "Facing",
  totalFloors: "Total Floors",
  condition: "Condition",
  location: "Location",
  price: "Price",
  availability: "Availability",
  possession: "Possession",
  installment: "Installment",
};

function Column({ keys, details }: { keys: Array<keyof PropertyDetailFields>; details: PropertyDetailFields }) {
  return (
    <ul className="space-y-2.5">
      {keys.map((key) => (
        <li key={key} className="text-sm">
          <span className="font-semibold text-ink">{labels[key]}: </span>
          <span className="text-muted">{details[key]}</span>
        </li>
      ))}
    </ul>
  );
}

export function PropertyDetailsCard({ details, className }: PropertyDetailsCardProps) {
  return (
    <section className={cn("rounded border border-line bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-bold text-ink sm:text-lg">Property Details</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Column keys={leftKeys} details={details} />
        <Column keys={rightKeys} details={details} />
      </div>
    </section>
  );
}
