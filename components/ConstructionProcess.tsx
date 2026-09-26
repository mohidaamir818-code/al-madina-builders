import Image from "next/image";
import {
  ClipboardList,
  FileText,
  HardHat,
  KeyRound,
  MessageCircle,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import { processSteps } from "@/data/process";
import { Container } from "@/components/ui/Container";

const icons: Record<(typeof processSteps)[number]["icon"], LucideIcon> = {
  consultation: MessageCircle,
  design: FileText,
  estimate: ClipboardList,
  build: HardHat,
  interior: Sofa,
  delivery: KeyRound,
};

export function ConstructionProcess() {
  return (
    <section id="construction" className="relative overflow-hidden bg-[#06180e] scroll-mt-24">
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[38%] lg:block">
        <Image
          src="/images/construction-frame.jpg"
          alt="Bright unfinished concrete house frame on a construction site"
          fill
          sizes="38vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#06180e]" />
      </div>

      <Container className="relative z-10 py-14 lg:py-16">
        <div className="lg:ml-[36%]">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-bright uppercase sm:text-sm">
            Our Construction Process
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            From Planning to Perfection
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            We make the construction process simple, transparent and stress-free for you. Your dream home is just a step
            away.
          </p>
        </div>

        <div className="relative mt-10 lg:mt-14 lg:ml-[36%]">
          <div className="absolute top-5 right-[4%] left-[4%] hidden h-px bg-[#C9F26B] lg:block" />
          <div className="absolute top-5 bottom-5 left-5 w-px bg-[#C9F26B]/70 lg:hidden" />

          <ol className="grid grid-cols-1 gap-8 lg:grid-cols-6 lg:gap-5">
            {processSteps.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.step} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white ring-4 ring-[#06180e]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.step}. {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>

      <div className="relative h-48 overflow-hidden lg:hidden">
        <Image
          src="/images/construction-frame.jpg"
          alt="Bright unfinished concrete house frame on a construction site"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
