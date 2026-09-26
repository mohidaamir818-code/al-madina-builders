import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function HousePlansHero({ banner }: Props) {
  return (
    <PageBanner
      banner={banner}
      fallbackImage="/images/house-plans-hero.jpg"
      alt="House Maps page banner"
      priority
    />
  );
}
