import {
  FileText,
  Handshake,
  HeartHandshake,
  Home,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { companyHighlights } from "@/data/about";
import { Container } from "@/components/ui/Container";

const icons: Record<(typeof companyHighlights)[number]["icon"], LucideIcon> = {
  shield: ShieldCheck,
  file: FileText,
  guide: Handshake,
  heart: HeartHandshake,
};

export function CompanyIntroSection() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Our Company —</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Al Madina Builders & Property Advisor</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Al Madina Builders & Property Advisor is a trusted name in the real estate industry, based in Multan,
              Pakistan. We specialize in helping individuals and families find the right property — whether it&apos;s for
              living, investment, or commercial purpose.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              With a commitment to transparency, reliability and customer satisfaction, we provide complete real estate
              solutions under one roof.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {companyHighlights.map((item) => {
                const Icon = icons[item.icon];
                return (
                  <div key={item.title} className="text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-2 text-xs font-semibold text-ink">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rounded border border-line bg-mint p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Home className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-script text-3xl leading-[1.05] text-[#0B3B1E]">
                Your Dream Our Mission
                <span className="mt-1 block h-[3px] w-28 rounded-sm bg-primary" />
              </p>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">
              We believe that real estate is not just about buying or selling property, it&apos;s about building better
              lives. Our team is dedicated to offering honest advice, professional support and personalized solutions to
              meet your unique needs.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
