import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";
import { Container } from "@/components/ui/Container";

type Props = { banner?: SiteBanner | null };

export function DreamHomeBanner({ banner }: Props) {
  return (
    <div className="bg-mint py-8 lg:py-10">
      <Container>
        <div className="overflow-hidden rounded-md shadow-sm">
          <PageBanner
            banner={banner}
            fallbackImage="/images/construction-dream-home.jpg"
            alt="Build your dream home with Al Madina"
            size="section"
          />
        </div>
      </Container>
    </div>
  );
}
