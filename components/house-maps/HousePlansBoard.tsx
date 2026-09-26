"use client";

import { Home } from "lucide-react";
import type { HousePlan } from "@/data/housePlans";
import { Container } from "@/components/ui/Container";
import { PlanCard } from "@/components/house-maps/PlanCard";
import { CustomPlanBanner } from "@/components/house-maps/CustomPlanBanner";

type HousePlansBoardProps = {
  plans: HousePlan[];
};

export function HousePlansBoard({ plans }: HousePlansBoardProps) {
  return (
    <div className="relative z-20 -mt-6 pb-14">
      <Container>
        <div className="mt-2 flex items-start gap-2">
          <Home className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-bold text-primary">Featured House Plans</h2>
            <p className="text-sm text-muted">Modern layouts | Smart use of space | Designed for your comfort</p>
          </div>
        </div>

        {plans.length === 0 ? (
          <p className="mt-6 rounded border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
            Abhi koi house map live nahi hai. Admin panel se pehla map add karein.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(420px,1fr))]">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <CustomPlanBanner />
        </div>
      </Container>
    </div>
  );
}
