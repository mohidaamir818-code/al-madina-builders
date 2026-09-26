import { Clock, HardHat, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";

const items = [
  {
    title: "Quality Construction",
    description: "Using the best materials and modern techniques.",
    icon: HardHat,
  },
  {
    title: "Transparent Estimates",
    description: "No hidden charges, complete clarity.",
    icon: ShieldCheck,
  },
  {
    title: "Experienced Team",
    description: "Skilled professionals with proven experience.",
    icon: Users,
  },
  {
    title: "On-Time Progress",
    description: "We value your time and commitments.",
    icon: Clock,
  },
];

export function WhyChooseSection() {
  return (
    <section className="bg-mint py-12 lg:py-14">
      <Container>
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Why Choose Al Madina Builders?</h2>
          <p className="mt-2 text-sm text-muted">
            Your trusted partner for construction and real estate solutions.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className={`flex gap-3 ${index < items.length - 1 ? "lg:border-r lg:border-line lg:pr-6" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
