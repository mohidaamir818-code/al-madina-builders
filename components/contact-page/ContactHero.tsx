import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function ContactHero({ banner }: Props) {
  return (
    <PageBanner
      banner={banner}
      fallbackImage="/images/projects-hero.jpg"
      alt="Contact page banner"
      priority
    />
  );
}
