import { HardHat, Home, Map, TrendingUp } from "lucide-react";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
import { BannerImages, resolveBannerImages } from "@/components/banners/BannerImages";
import { Container } from "@/components/ui/Container";

const chips = [
  { label: "Property", icon: Home },
  { label: "Construction", icon: HardHat },
  { label: "House Maps", icon: Map },
  { label: "Investment", icon: TrendingUp },
];

const DEFAULT_BUTTONS = [
  { label: "View Properties", href: "#properties", style: "primary" as const },
  { label: "Get House Map", href: "#house-maps", style: "outline" as const },
];

type HeroProps = {
  banner?: SiteBanner | null;
};

export function Hero({ banner }: HeroProps) {
  const { desktop, mobile } = resolveBannerImages(banner, "/images/hero-banner.jpg");
  const eyebrow = banner?.eyebrow || "Trusted • Professional • Reliable";
  const title = banner?.title?.trim() || "AL MADINA BUILDERS &";
  const showDefaultAccent = !banner?.title?.trim();
  const subtitle =
    banner?.subtitle || "We Deal In Residential, Commercial & Rental Properties";
  const script = banner?.scriptText || "Build Your Future With Us";
  const buttons = banner?.buttons?.length ? banner.buttons : DEFAULT_BUTTONS;

  return (
    <section
      id="home"
      className="relative isolate min-h-[min(88svh,640px)] overflow-hidden bg-[#06180e] scroll-mt-20 sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[680px]"
    >
      <BannerImages
        desktopSrc={desktop}
        mobileSrc={mobile}
        alt="Al Madina Builders homepage banner"
        priority
        desktopSizes="100vw"
        mobileSizes="100vw"
        mobileClassName="object-cover object-center sm:object-[72%_center]"
        desktopClassName="object-cover object-[72%_center]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#06180e] via-[#06180e]/85 to-[#06180e]/35 sm:via-[#06180e]/80 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06180e]/70 via-transparent to-[#06180e]/30" />

      {script ? (
        <p className="font-script absolute top-10 right-5 z-10 hidden max-w-[180px] text-right text-[40px] leading-[1.05] text-white md:block lg:top-16 lg:right-16 lg:max-w-[220px] lg:text-5xl">
          {script}
        </p>
      ) : null}

      <Container className="relative z-10 flex min-h-[min(88svh,640px)] items-end pb-10 pt-16 sm:min-h-[560px] sm:items-center sm:py-14 lg:min-h-[620px] lg:py-20 xl:min-h-[680px]">
        <div className="w-full max-w-2xl text-white">
          {eyebrow ? (
            <p className="mb-3 text-xs font-medium tracking-wide text-primary-bright sm:mb-4 sm:text-sm">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-[28px] leading-[1.08] font-extrabold tracking-tight break-words uppercase sm:text-[36px] sm:leading-[1.05] md:text-5xl lg:text-[56px] xl:text-[62px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">PROPERTY ADVISOR</span>
            ) : null}
          </h1>

          {showDefaultAccent ? (
            <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/90 sm:mt-7 sm:gap-x-5 sm:text-sm">
              {chips.map(({ label, icon: Icon }) => (
                <li key={label} className="inline-flex items-center gap-1.5 sm:gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary-bright sm:h-4 sm:w-4" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          ) : null}

          {subtitle ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-6 sm:text-base">
              {subtitle}
            </p>
          ) : null}

          <BannerCtaButtons buttons={buttons} className="mt-6 sm:mt-8" />
        </div>
      </Container>
    </section>
  );
}
