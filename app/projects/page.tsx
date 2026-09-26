import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectsBoard } from "@/components/projects/ProjectsBoard";
import { TrustStrip } from "@/components/projects/TrustStrip";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";

export const metadata: Metadata = {
  title: "Our Projects | Al Madina Builders Multan",
  description:
    "Explore ongoing and upcoming residential and commercial projects by Al Madina Builders in Multan.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [banner, ctaBanner] = await Promise.all([
    getBannerByPageKey("projects").catch(() => null),
    getBannerByPageKey("projects-cta").catch(() => null),
  ]);

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <ProjectsHero banner={banner} />
        <ProjectsBoard ctaBanner={ctaBanner} />
        <TrustStrip />
      </main>
      <Footer />
    </>
  );
}
