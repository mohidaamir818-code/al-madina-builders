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
    <section id="about" className="scroll-mt-24 bg-mint py-10 sm:py-14 lg:py-20">
      <Container>
        <SectionHeader
          label="Why Choose Us"
          title="Your Trusted Property & Construction Partner"
        />
        <div className="mt-3 text-center sm:mt-4">
          <a
            href="/about"
            className="inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Read full About Us →
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
          {whyChooseUs.map((item) => {
            const Icon = icons[item.icon];
            return (
              <article
                key={item.title}
                className="flex h-full flex-col items-center rounded-md border border-line bg-white px-3 py-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:px-4 sm:py-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F6EC] sm:h-12 sm:w-12">
                  <Icon
                    className="h-5 w-5 text-primary sm:h-6 sm:w-6"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-3 text-sm leading-snug font-semibold text-ink sm:mt-4 sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-5 text-muted sm:text-sm sm:leading-6">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
