import type { SiteBanner } from "@/lib/admin/bannerStore";
import { PageBanner } from "@/components/banners/PageBanner";
import { Container } from "@/components/ui/Container";

type Props = { banner?: SiteBanner | null };

export function WhyChooseBanner({ banner }: Props) {
  return (
    <section className="bg-white py-8 lg:py-12">
      <Container>
        <div className="overflow-hidden rounded-md shadow-sm">
          <PageBanner
            banner={banner}
            fallbackImage="/images/listing-house-dusk.jpg"
            alt="Why choose Al Madina banner"
            size="section"
          />
        </div>
      </Container>
    </section>
  );
}
