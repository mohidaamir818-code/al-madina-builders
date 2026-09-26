import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function ConstructionHero({ banner }: Props) {
  return (
    <PageBanner
      banner={banner}
      fallbackImage="/images/construction-hero.jpg"
      alt="Construction page banner"
      priority
    />
  );
}
