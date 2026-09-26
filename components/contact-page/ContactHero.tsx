import Image from "next/image";
import Link from "next/link";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerCtaButtons } from "@/components/banners/BannerCtaButtons";
import { resolveBannerImages } from "@/components/banners/BannerImages";
import { Container } from "@/components/ui/Container";

type ContactHeroProps = {
  banner?: SiteBanner | null;
};

export function ContactHero({ banner }: ContactHeroProps) {
  const { desktop, mobile } = resolveBannerImages(banner, "/images/projects-hero.jpg");
  const title = banner?.title?.trim() || "GET IN TOUCH";
  const showDefaultAccent = !banner?.title?.trim();
  const subtitle =
    banner?.subtitle ||
    "We are here to help! Have any questions, need guidance, or want to book a site visit? Feel free to reach out to us.";
  const script = banner?.scriptText || "Your Dream Our Mission";
  const buttons = banner?.buttons || [];

  return (
    <section className="relative isolate overflow-hidden bg-[#0B3B1E]">
      <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
        <Image
          src={desktop}
          alt="Contact page banner"
          fill
          priority
          sizes="48vw"
          className="object-cover"
          unoptimized={desktop.includes("supabase") || desktop.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B1E] via-[#0B3B1E]/70 to-transparent" />
      </div>

      {script ? (
        <p className="font-script absolute top-8 right-6 z-10 hidden max-w-[200px] text-right text-[36px] leading-[1.05] text-white lg:block xl:right-14 xl:text-[42px]">
          {script}
          <span className="ml-auto mt-1 block h-[3px] w-28 rounded-sm bg-primary-bright" />
        </p>
      ) : null}

      <Container className="relative z-10 py-10 lg:min-h-[300px] lg:py-14">
        <div className="max-w-xl text-white">
          <p className="text-xs text-white/70">
            <Link href="/" className="hover:text-primary-bright">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="text-primary-bright">Contact Us</span>
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[52px]">
            {title}
            {showDefaultAccent ? (
              <span className="mt-1 block text-primary-bright">WITH US</span>
            ) : null}
          </h1>
          {subtitle ? <p className="mt-4 text-sm leading-6 text-white/80 sm:text-base">{subtitle}</p> : null}
          {buttons.length ? <BannerCtaButtons buttons={buttons} className="mt-6" /> : null}
        </div>

        <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded sm:aspect-[16/10] lg:hidden">
          <Image
            src={mobile}
            alt="Contact page banner"
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
