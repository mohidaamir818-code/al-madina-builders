import { Home, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

type PropertyTitleBlockProps = {
  title: string;
  subtitle: string;
  price: string;
  negotiable: boolean;
  fullAddress: string;
  className?: string;
};

export function PropertyTitleBlock({
  title,
  subtitle,
  price,
  negotiable,
  fullAddress,
  className,
}: PropertyTitleBlockProps) {
  return (
    <div className={cn("rounded border border-line bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary text-white">
          <Home className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>
          <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-2xl font-bold text-primary sm:text-3xl">{price}</p>
        {negotiable ? (
          <span className="rounded border border-[#CDE8D4] bg-[#EAF7EE] px-2.5 py-1 text-xs font-semibold text-primary">
            Negotiable
          </span>
        ) : null}
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-sm text-muted">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {fullAddress}
      </p>
    </div>
  );
}
