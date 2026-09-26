import Image from "next/image";
import Link from "next/link";
import { Compass, Home, LayoutGrid, Lightbulb } from "lucide-react";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
import { Container } from "@/components/ui/Container";

const badges = [
  { label: "Modern Designs", sub: "Latest layouts", icon: Lightbulb },
  { label: "Space Efficient", sub: "Smart planning", icon: LayoutGrid },
  { label: "Customizable Options", sub: "Made for you", icon: Compass },
  { label: "Expert Guidance", sub: "From our team", icon: Home },
];

type HousePlansHeroProps = {
  banner?: SiteBanner | null;
};

export function HousePlansHero({ banner }: HousePlansHeroProps) {
  const image = banner?.imageUrl || "/images/house-plans-hero.jpg";
  const title = banner?.title?.trim() || "HOUSE PLANS";
  const showDefaultAccent = !banner?.title?.trim();
  const subtitle =
    banner?.subtitle ||
    "Explore our modern and well-designed house plans. Find the perfect layout for your dream home.";
  const buttons = banner?.buttons || [];

  return (
    <section className="relative isolate overflow-hidden bg-[#0B3B1E]">
      <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
        <Image
          src={image}
          alt="House Maps page banner"
          fill
          priority
          sizes="48vw"
          className="object-cover"
          unoptimized={image.includes("supabase") || image.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B1E] via-[#0B3B1E]/70 to-transparent" />
      </div>
      <Container className="relative z-10 py-10 lg:min-h-[300px] lg:py-14">
        <div className="max-w-xl text-white">
          <p className="text-xs text-white/70">
            <Link href="/" className="hover:text-primary-bright">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="text-primary-bright">House Plans</span>
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[52px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">& DESIGNS</span>
            ) : null}
          </h1>
          {subtitle ? <p className="mt-4 text-sm leading-6 text-white/80 sm:text-base">{subtitle}</p> : null}
          {showDefaultAccent ? (
            <ul className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-5">
              {badges.map(({ label, sub, icon: Icon }) => (
                <li key={label} className="inline-flex items-center gap-2 text-xs">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{label}</span>
                    <span className="text-white/70">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {buttons.length ? <BannerCtaButtons buttons={buttons} className="mt-6" /> : null}
        </div>
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded lg:hidden">
          <Image
            src={image}
            alt="House Maps page banner"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={image.includes("supabase") || image.startsWith("data:")}
          />
        </div>
      </Container>
    </section>
  );
}
