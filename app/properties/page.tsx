import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertiesHero } from "@/components/properties/PropertiesHero";
import { PropertiesBoard } from "@/components/properties/PropertiesBoard";
import { getPublishedListings } from "@/lib/publicProperties";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent | Al Madina Builders Multan",
  description:
    "Browse residential, commercial and rental properties listed by Al Madina Builders & Property Advisor.",
};

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const [listings, banner] = await Promise.all([
    getPublishedListings(),
    getBannerByPageKey("properties").catch(() => null),
  ]);

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <PropertiesHero banner={banner} />
        <PropertiesBoard listings={listings} />
      </main>
      <Footer />
    </>
  );
}
