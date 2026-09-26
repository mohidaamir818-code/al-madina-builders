import Image from "next/image";
import { HardHat, Home, Map, TrendingUp } from "lucide-react";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
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
  const image = banner?.imageUrl || "/images/hero-banner.jpg";
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
      className="relative isolate min-h-[560px] overflow-hidden bg-[#06180e] scroll-mt-20 lg:min-h-[620px] xl:min-h-[680px]"
    >
      <Image
        src={image}
        alt="Al Madina Builders homepage banner"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center]"
        unoptimized={image.includes("supabase") || image.startsWith("data:")}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#06180e] via-[#06180e]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06180e]/55 via-transparent to-[#06180e]/25" />

      {script ? (
        <p className="font-script absolute top-10 right-5 z-10 hidden max-w-[180px] text-right text-[40px] leading-[1.05] text-white md:block lg:top-16 lg:right-16 lg:max-w-[220px] lg:text-5xl">
          {script}
        </p>
      ) : null}

      <Container className="relative z-10 flex min-h-[560px] items-center py-14 lg:min-h-[620px] lg:py-20 xl:min-h-[680px]">
        <div className="max-w-2xl text-white">
          {eyebrow ? (
            <p className="mb-4 text-sm font-medium tracking-wide text-primary-bright">{eyebrow}</p>
          ) : null}

          <h1 className="text-[36px] leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[56px] xl:text-[62px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">PROPERTY ADVISOR</span>
            ) : null}
          </h1>

          {showDefaultAccent ? (
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
              {chips.map(({ label, icon: Icon }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary-bright" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          ) : null}

          {subtitle ? <p className="mt-6 text-sm text-white/80 sm:text-base">{subtitle}</p> : null}

          <BannerCtaButtons buttons={buttons} className="mt-8" />
        </div>
      </Container>
    </section>
  );
}
