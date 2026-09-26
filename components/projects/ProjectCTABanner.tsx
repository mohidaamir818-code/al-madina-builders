import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function ProjectCTABanner({ banner }: Props) {
  return (
    <div className="overflow-hidden rounded-md shadow-sm">
      <PageBanner
        banner={banner}
        fallbackImage="/images/project-cta-house.jpg"
        alt="Projects CTA banner"
        size="section"
      />
    </div>
  );
}
