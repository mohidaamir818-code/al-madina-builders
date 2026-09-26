import Image from "next/image";
import Link from "next/link";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
import { resolveBannerImages } from "@/components/banners/BannerImages";
import { Container } from "@/components/ui/Container";

type AboutHeroProps = {
  banner?: SiteBanner | null;
};

export function AboutHero({ banner }: AboutHeroProps) {
  const { desktop, mobile } = resolveBannerImages(banner, "/images/projects-hero.jpg");
  const title = banner?.title?.trim() || "ABOUT";
  const showDefaultAccent = !banner?.title?.trim();
  const eyebrow = banner?.eyebrow;
  const partnerLine =
    banner?.subtitle?.split("\n")[0] ||
    "Your Trusted Partner in Real Estate & Property Solutions";
  const body =
    banner?.subtitle?.includes("\n")
      ? banner.subtitle.split("\n").slice(1).join("\n")
      : banner?.title
        ? banner.subtitle
        : "Building dreams, creating value and providing reliable property solutions for a better tomorrow.";
  const script = banner?.scriptText || "Building Better Tomorrows";
  const buttons = banner?.buttons || [];

  return (
    <section className="relative overflow-hidden bg-[#0B3B1E]">
      <div className="absolute inset-y-0 right-0 z-0 hidden w-1/2 lg:block">
        <Image
          src={desktop}
          alt="About Us banner"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
          unoptimized={desktop.includes("supabase") || desktop.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B1E] via-[#0B3B1E]/55 to-transparent" />
      </div>

      {script ? (
        <p className="font-script absolute top-8 right-8 z-20 hidden max-w-[220px] text-right text-[36px] leading-[1.05] text-white drop-shadow lg:block xl:right-14 xl:text-[42px]">
          {script}
          <span className="ml-auto mt-1 block h-[3px] w-32 rounded-sm bg-primary-bright" />
        </p>
      ) : null}

      <Container className="relative z-10 py-12 lg:min-h-[420px] lg:py-16">
        <div className="max-w-xl text-white lg:w-[48%]">
          <p className="text-xs text-white/70">
            <Link href="/" className="hover:text-primary-bright">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="text-primary-bright">About Us</span>
          </p>
          {eyebrow ? (
            <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-primary-bright uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[52px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">US</span>
            ) : null}
          </h1>
          {partnerLine ? (
            <p className="mt-4 text-base font-semibold text-white sm:text-lg">{partnerLine}</p>
          ) : null}
          {body && body !== partnerLine ? (
            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">{body}</p>
          ) : null}
          {buttons.length ? <BannerCtaButtons buttons={buttons} className="mt-6" /> : null}
        </div>

        <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded sm:aspect-[16/10] lg:hidden">
          <Image
            src={mobile}
            alt="About Us banner"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={mobile.includes("supabase") || mobile.startsWith("data:")}
          />
          {script ? (
            <p className="font-script absolute top-4 right-4 text-3xl leading-[1.05] text-white">{script}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
