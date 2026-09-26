import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function ProjectsHero({ banner }: Props) {
  return (
    <PageBanner
      banner={banner}
      fallbackImage="/images/projects-hero.jpg"
      alt="Projects page banner"
      priority
    />
  );
}
