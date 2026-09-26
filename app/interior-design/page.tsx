import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteriorDesignBoard } from "@/components/interior/InteriorDesignBoard";
import { getPublishedInteriors } from "@/lib/admin/interiorStore";
import type { InteriorCategory, InteriorDesign } from "@/data/interiorDesigns";

export const metadata: Metadata = {
  title: "Interior Design | Al Madina Builders Multan",
  description:
    "Explore modern interior design packages for living rooms, bedrooms, kitchens and complete homes in Multan.",
};

export const dynamic = "force-dynamic";

export default async function InteriorDesignPage() {
  let rows: Awaited<ReturnType<typeof getPublishedInteriors>> = [];
  try {
    rows = await getPublishedInteriors();
  } catch (err) {
    console.warn("[interior-design page] failed to load designs:", err);
  }

  const designs: InteriorDesign[] = rows.map((item) => ({
    id: item.slug,
    title: item.title,
    category: item.category as InteriorCategory,
    location: item.location,
    price: item.price,
    rating: item.rating,
    reviews: item.reviews,
    description: item.description,
    image: item.image,
    images: item.images,
    features: item.features,
  }));

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <InteriorDesignBoard designs={designs} />
      </main>
      <Footer />
    </>
  );
}
