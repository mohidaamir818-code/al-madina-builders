import Image from "next/image";
import { BadgeCheck, Handshake, Home, ShieldCheck } from "lucide-react";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
import { resolveBannerImages } from "@/components/banners/BannerImages";
import { Container } from "@/components/ui/Container";

const badges = [
  { label: "Trusted Deals", icon: Handshake },
  { label: "Verified Listings", icon: BadgeCheck },
  { label: "Best Market Prices", icon: ShieldCheck },
  { label: "Expert Guidance", icon: Home },
];

type PropertiesHeroProps = {
  banner?: SiteBanner | null;
};

function isRemote(src: string) {
  return src.includes("supabase") || src.startsWith("data:");
}

export function PropertiesHero({ banner }: PropertiesHeroProps) {
  const { desktop, mobile } = resolveBannerImages(banner, "/images/properties-hero.jpg");
  const eyebrow = banner?.eyebrow || "Premium Properties";
  const title = banner?.title?.trim() || "PROPERTIES";
  const showDefaultAccent = !banner?.title?.trim();
  const subtitle =
    banner?.subtitle ||
    "Find your dream home, investment property or rental option in the best locations of Multan and surrounding areas.";
  const script = banner?.scriptText || "Your Dream Home Awaits";
  const buttons = banner?.buttons || [];

  return (
    <section className="relative isolate overflow-hidden bg-[#0B3B1E]">
      <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <Image
          src={desktop}
          alt="Properties page banner"
          fill
          priority
          sizes="52vw"
          className="object-cover object-center"
          unoptimized={isRemote(desktop)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B1E] via-[#0B3B1E]/55 to-transparent" />
      </div>

      {script ? (
        <p className="font-script absolute top-8 right-6 z-10 hidden max-w-[200px] text-right text-[38px] leading-[1.05] text-white lg:block xl:right-16 xl:text-[44px]">
          {script}
          <span className="mx-auto mt-1 block h-[3px] w-28 rounded-sm bg-yellow-400" />
        </p>
      ) : null}

      <Container className="relative z-10 py-12 lg:min-h-[340px] lg:py-16">
        <div className="max-w-xl text-white">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-bright uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[56px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">FOR SALE & RENT</span>
            ) : null}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">{subtitle}</p>
          ) : null}
          {showDefaultAccent ? (
            <ul className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-x-6">
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

        <div className="relative mt-8 aspect-[3/4] w-full overflow-hidden rounded-md lg:hidden">
          <Image
            src={mobile}
            alt="Properties page banner"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={isRemote(mobile)}
          />
          {script ? (
            <p className="font-script absolute top-4 right-4 text-3xl text-white">{script}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
