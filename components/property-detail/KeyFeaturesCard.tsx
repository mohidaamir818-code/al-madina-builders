import { CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/cn";

type KeyFeaturesCardProps = {
  features: string[];
  className?: string;
};

export function KeyFeaturesCard({ features, className }: KeyFeaturesCardProps) {
  return (
    <section className={cn("rounded border border-line bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
          <Star className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-bold text-ink sm:text-lg">Key Features</h2>
      </div>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
