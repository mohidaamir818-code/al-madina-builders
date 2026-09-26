import { ClipboardList, HardHat, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    step: 1,
    title: "Share Your Requirements",
    description: "Tell us about your project and budget.",
    icon: MessageSquare,
  },
  {
    step: 2,
    title: "Site/Plot Consultation",
    description: "We visit your site and suggest the best plan.",
    icon: MapPin,
  },
  {
    step: 3,
    title: "Estimate & Planning",
    description: "Get detailed cost estimate, design and timeline.",
    icon: ClipboardList,
  },
  {
    step: 4,
    title: "Construction Begins",
    description: "We start building with quality and commitment.",
    icon: HardHat,
  },
];

export function StepsSection() {
  return (
    <section className="bg-mint py-12 lg:py-16">
      <Container>
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">How It Works</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Simple Steps to Your Dream Project</h2>
          <p className="mt-2 text-sm text-muted">
            We make the construction process easy, transparent and hassle-free.
          </p>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, description, icon: Icon }, index) => (
            <li key={title} className="relative text-center">
              {index < steps.length - 1 ? (
                <span className="absolute top-6 left-[60%] hidden h-px w-[80%] bg-primary/30 lg:block" />
              ) : null}
              <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B3B1E] text-[10px] font-bold text-white">
                  {step}
                </span>
              </span>
              <h3 className="mt-4 text-sm font-bold text-ink">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
