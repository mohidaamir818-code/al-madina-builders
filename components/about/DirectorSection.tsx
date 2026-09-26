import { Eye, Gem, Quote, Target, type LucideIcon } from "lucide-react";
import { directorPillars } from "@/data/about";
import { Container } from "@/components/ui/Container";

const icons: Record<(typeof directorPillars)[number]["icon"], LucideIcon> = {
  eye: Eye,
  target: Target,
  gem: Gem,
};

export function DirectorSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B3B1E] py-12 text-white lg:py-16">
      <HomeWatermark />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="inline-flex rounded border border-primary-bright px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-bright uppercase">
              Our Director
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Malik Aamir Hussain</h2>
            <p className="mt-1 text-sm text-primary-bright">Director – Al Madina Builders & Property Advisor</p>
            <p className="mt-5 text-sm leading-7 text-white/80">
              Malik Aamir Hussain is the visionary leader and driving force behind Al Madina Builders & Property Advisor.
              With his extensive experience in the real estate sector and strong business acumen, he has built a
              reputation for trust, excellence and customer satisfaction.
            </p>
            <blockquote className="mt-6 border-l-2 border-primary-bright pl-4">
              <Quote className="mb-2 h-5 w-5 text-primary-bright" aria-hidden="true" />
              <p className="text-sm leading-7 text-white/90 italic">
                &ldquo;Our mission is not just to sell properties, but to build long-term relationships based on trust and
                value.&rdquo;
              </p>
              <p className="font-script mt-4 text-2xl text-primary-bright">
                Malik Aamir Hussain
                <span className="mt-1 block h-[2px] w-28 rounded-sm bg-primary-bright" />
              </p>
            </blockquote>
          </div>

          <div className="space-y-0">
            {directorPillars.map((item, index) => {
              const Icon = icons[item.icon];
              return (
                <div
                  key={item.title}
                  className={`flex gap-4 py-5 ${index < directorPillars.length - 1 ? "border-b border-white/15" : ""}`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/75">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function HomeWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
      <svg viewBox="0 0 24 24" className="h-72 w-72 fill-white" aria-hidden="true">
        <path d="M12 3 3 10v11h6v-6h6v6h6V10z" />
      </svg>
    </div>
  );
}
