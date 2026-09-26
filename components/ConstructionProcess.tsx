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
      {/* Desktop side image only */}
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

      <Container className="relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="lg:ml-[36%]">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary-bright uppercase sm:text-sm">
            Our Construction Process
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:mt-2 sm:text-3xl lg:text-4xl">
            From Planning to Perfection
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-5 text-white/75 sm:mt-3 sm:text-base sm:leading-6">
            We make the construction process simple, transparent and stress-free for you. Your dream
            home is just a step away.
          </p>
        </div>

        <div className="relative mt-6 sm:mt-10 lg:mt-14 lg:ml-[36%]">
          <div className="absolute top-4 right-[2%] left-[2%] hidden h-px bg-[#C9F26B] sm:block lg:top-5 lg:right-[4%] lg:left-[4%]" />

          <ol className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
            {processSteps.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li
                  key={item.step}
                  className="relative flex flex-col items-center text-center"
                >
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white ring-[3px] ring-[#06180e] sm:h-10 sm:w-10 sm:ring-4">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                  </span>
                  <div className="mt-2 min-w-0 sm:mt-3">
                    <h3 className="text-[11px] leading-tight font-semibold text-white sm:text-sm">
                      <span className="text-primary-bright">{item.step}. </span>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[10px] leading-3.5 text-white/70 sm:text-sm sm:leading-5">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
