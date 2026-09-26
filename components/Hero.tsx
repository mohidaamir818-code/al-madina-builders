import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type HeroProps = {
  banner?: SiteBanner | null;
};

export function Hero({ banner }: HeroProps) {
  return (
    <div id="home" className="scroll-mt-20">
      <PageBanner
        banner={banner}
        fallbackImage="/images/hero-banner.jpg"
        alt="Al Madina Builders homepage banner"
        priority
        size="hero"
      />
    </div>
  );
}
