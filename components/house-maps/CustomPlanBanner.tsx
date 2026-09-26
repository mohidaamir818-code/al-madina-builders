import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";

type Props = { banner?: SiteBanner | null };

export function CustomPlanBanner({ banner }: Props) {
  return (
    <div className="overflow-hidden rounded-md shadow-sm">
      <PageBanner
        banner={banner}
        fallbackImage="/images/custom-plan-model.jpg"
        alt="Custom house plan banner"
        size="section"
      />
    </div>
  );
}
