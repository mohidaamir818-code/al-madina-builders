import Image from "next/image";
import Link from "next/link";
import type { HousePlan } from "@/data/housePlans";

export function PlanCard({ plan }: { plan: HousePlan }) {
  return (
    <article className="flex overflow-hidden rounded border border-line bg-white shadow-sm">
      <div className="relative min-h-[170px] w-[42%] min-w-[120px] shrink-0 self-stretch">
        <Image
          src={plan.image}
          alt={`${plan.title} floor plan`}
          fill
          sizes="(max-width: 640px) 42vw, 210px"
          className="object-cover"
          loading="lazy"
        />
        {plan.badge ? (
          <span className="absolute top-2 left-2 rounded bg-[#0B3B1E] px-2 py-1 text-[11px] font-semibold text-white">
            {plan.badge}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm font-bold text-ink sm:text-base">{plan.title}</h3>
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">{plan.description}</p>
        {plan.price && plan.price !== "PKR 0" ? (
          <p className="mt-2 text-sm font-bold text-primary">{plan.price}</p>
        ) : null}
        <Link
          href={`/house-maps/${plan.id}`}
          className="mt-auto inline-flex h-9 w-full items-center justify-center rounded bg-[#0B3B1E] text-xs font-semibold text-white transition-all duration-200 hover:bg-[#072816]"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
