import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function AboutHero({ banner }: Props) {
  return (
    <PageBanner
      banner={banner}
      fallbackImage="/images/projects-hero.jpg"
      alt="About Us page banner"
      priority
    />
  );
}
