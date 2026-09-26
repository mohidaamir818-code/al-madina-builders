import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function PropertiesHero({ banner }: Props) {
  return (
    <PageBanner
      banner={banner}
      fallbackImage="/images/properties-hero.jpg"
      alt="Properties page banner"
      priority
    />
  );
}
