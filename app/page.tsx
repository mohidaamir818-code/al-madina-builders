import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Societies } from "@/components/Societies";
import { Services } from "@/components/Services";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { ConstructionProcess } from "@/components/ConstructionProcess";
import { HouseMaps } from "@/components/HouseMaps";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { DealAlerts } from "@/components/DealAlerts";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getFeaturedListings } from "@/lib/publicProperties";
import { getPublishedFeedbacks } from "@/lib/feedbackStore";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";
import { getPublishedHouseMaps } from "@/lib/admin/houseMapStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, reviews, homeBanner, publishedMaps] = await Promise.all([
    getFeaturedListings(20),
    getPublishedFeedbacks(12).catch(() => []),
    getBannerByPageKey("home").catch(() => null),
    getPublishedHouseMaps().catch(() => []),
  ]);

  const homeMaps = [...publishedMaps]
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main>
        <Hero banner={homeBanner} />
        <Societies />
        <Services />
        <div id="projects" className="scroll-mt-24">
          <FeaturedProperties listings={featured} />
        </div>
        <ConstructionProcess />
        <HouseMaps maps={homeMaps} />
        <WhyChooseUs />
        <Testimonials reviews={reviews} />
        <DealAlerts />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
