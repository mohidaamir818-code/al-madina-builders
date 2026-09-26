import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HousePlansHero } from "@/components/house-maps/HousePlansHero";
import { HousePlansBoard } from "@/components/house-maps/HousePlansBoard";
import { getPublishedHouseMaps } from "@/lib/admin/houseMapStore";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";
import type { HousePlan } from "@/data/housePlans";

export const metadata: Metadata = {
  title: "House Plans & Designs | Al Madina Builders Multan",
  description:
    "Explore 3 Marla, 5 Marla, 10 Marla and 1 Kanal house plans and custom map designs in Multan.",
};

export const dynamic = "force-dynamic";

export default async function HouseMapsPage() {
  let maps: Awaited<ReturnType<typeof getPublishedHouseMaps>> = [];
  try {
    maps = await getPublishedHouseMaps();
  } catch (err) {
    console.warn("[house-maps page] failed to load maps:", err);
  }

  const banner = await getBannerByPageKey("house-maps").catch(() => null);

  const plans: HousePlan[] = maps.map((m) => ({
    id: m.slug,
    title: m.title,
    badge: m.badge,
    beds: m.beds,
    baths: m.baths,
    sqft: m.sqft,
    floors: m.floors,
    description: m.description,
    price: m.price,
    image: m.image,
    images: m.images,
    features: m.features,
  }));

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <HousePlansHero banner={banner} />
        <HousePlansBoard plans={plans} />
      </main>
      <Footer />
    </>
  );
}
