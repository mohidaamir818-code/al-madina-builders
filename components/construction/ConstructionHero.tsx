import Image from "next/image";
import { Building2, HardHat, Home, RefreshCw } from "lucide-react";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
import { resolveBannerImages } from "@/components/banners/BannerImages";
import { Container } from "@/components/ui/Container";

const badges = [
  { label: "Residential Construction", icon: Home },
  { label: "Commercial Construction", icon: Building2 },
  { label: "Renovation & Remodeling", icon: RefreshCw },
  { label: "Turnkey Projects", icon: HardHat },
];

type ConstructionHeroProps = {
  banner?: SiteBanner | null;
};

export function ConstructionHero({ banner }: ConstructionHeroProps) {
  const { desktop, mobile } = resolveBannerImages(banner, "/images/construction-hero.jpg");
  const eyebrow = banner?.eyebrow || "Professional & Reliable";
  const title = banner?.title?.trim() || "CONSTRUCTION";
  const showDefaultAccent = !banner?.title?.trim();
  const subtitle =
    banner?.subtitle ||
    "We build your vision with quality, trust and expertise. From residential homes to commercial projects, we deliver excellence in every detail.";
  const script = banner?.scriptText || "Your Vision Our Construction Expertise";
  const buttons = banner?.buttons || [];

  return (
    <section className="relative isolate overflow-hidden bg-[#0B3B1E]">
      <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
        <Image
          src={desktop}
          alt="Construction page banner"
          fill
          priority
          sizes="54vw"
          className="object-cover object-center"
          unoptimized={desktop.includes("supabase") || desktop.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B1E] via-[#0B3B1E]/60 to-transparent" />
      </div>

      {script ? (
        <p className="font-script absolute top-8 right-6 z-10 hidden max-w-[230px] rotate-[-6deg] text-right text-[34px] leading-[1.05] text-white lg:block xl:right-14 xl:text-[40px]">
          {script}
          <span className="ml-auto mt-1 block h-[3px] w-32 rounded-sm bg-yellow-400" />
        </p>
      ) : null}

      <Container className="relative z-10 py-12 lg:min-h-[340px] lg:py-16">
        <div className="max-w-xl text-white">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.18em] text-[#C9F26B] uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[56px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">SERVICES</span>
            ) : null}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">{subtitle}</p>
          ) : null}
          {showDefaultAccent ? (
            <ul className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-x-5">
              {badges.map(({ label, icon: Icon }) => (
                <li key={label} className="inline-flex items-center gap-2 text-xs font-medium sm:text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
          {buttons.length ? <BannerCtaButtons buttons={buttons} className="mt-7" /> : null}
        </div>

        <div className="relative mt-8 aspect-[3/4] w-full overflow-hidden rounded lg:hidden">
          <Image
            src={mobile}
            alt="Construction page banner"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={mobile.includes("supabase") || mobile.startsWith("data:")}
          />
        </div>
      </Container>
    </section>
  );
}
