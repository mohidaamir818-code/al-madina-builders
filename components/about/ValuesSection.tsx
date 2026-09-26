import { Leaf, Lightbulb, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { drivingValues } from "@/data/about";
import { Container } from "@/components/ui/Container";

const icons: Record<(typeof drivingValues)[number]["icon"], LucideIcon> = {
  shield: ShieldCheck,
  users: Users,
  bulb: Lightbulb,
  leaf: Leaf,
};

export function ValuesSection() {
  return (
    <section className="bg-mint py-12 lg:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Our Values —</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">What Drives Us</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Our values are the foundation of everything we do. They guide our decisions, relationships and commitment
              to deliver the best for our clients and community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {drivingValues.map((item) => {
              const Icon = icons[item.icon];
              return (
                <article key={item.title} className="rounded border border-line bg-white p-4 text-center shadow-sm">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
