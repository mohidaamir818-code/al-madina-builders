import {
  Award,
  Headphones,
  Leaf,
  PersonStanding,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react";
import { whyChooseUs } from "@/data/whyChooseUs";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<(typeof whyChooseUs)[number]["icon"], LucideIcon> = {
  team: User,
  society: Award,
  maps: Leaf,
  quality: PersonStanding,
  deal: ShoppingBag,
  support: Headphones,
};

export function WhyChooseUs() {
  return (
    <section id="about" className="scroll-mt-24 bg-mint py-14 lg:py-20">
      <Container>
        <SectionHeader
          label="Why Choose Us"
          title="Your Trusted Property & Construction Partner"
        />
        <div className="mt-4 text-center">
          <a
            href="/about"
            className="inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Read full About Us →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {whyChooseUs.map((item) => {
            const Icon = icons[item.icon];
            return (
              <article
                key={item.title}
                className="rounded-md border border-line bg-white px-4 py-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F6EC]">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
