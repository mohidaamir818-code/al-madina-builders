import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerImages, resolveBannerImages } from "@/components/banners/BannerImages";

type HeroProps = {
  banner?: SiteBanner | null;
};

/** Home hero — uploaded banner only (no hardcoded text / buttons). */
export function Hero({ banner }: HeroProps) {
  const { desktop, mobile } = resolveBannerImages(banner, "/images/hero-banner.jpg");

  return (
    <section id="home" className="scroll-mt-20 bg-[#06180e]">
      {/* Mobile / tablet — vertical banner */}
      <div className="relative isolate overflow-hidden lg:hidden">
        <div className="relative aspect-[3/4] w-full max-h-[82svh] min-h-[440px] overflow-hidden sm:aspect-[4/5] sm:max-h-[75svh]">
          <BannerImages
            desktopSrc={desktop}
            mobileSrc={mobile}
            alt="Al Madina Builders homepage banner"
            priority
            desktopSizes="100vw"
            mobileSizes="100vw"
            mobileClassName="object-cover object-center"
            desktopClassName="object-cover object-center"
          />
        </div>
      </div>

      {/* Laptop / desktop — wide banner */}
      <div className="relative isolate hidden aspect-[21/9] min-h-[420px] max-h-[720px] w-full overflow-hidden lg:block">
        <BannerImages
          desktopSrc={desktop}
          mobileSrc={mobile}
          alt="Al Madina Builders homepage banner"
          priority
          desktopSizes="100vw"
          mobileSizes="100vw"
          mobileClassName="object-cover object-center"
          desktopClassName="object-cover object-center"
        />
      </div>
    </section>
  );
}
