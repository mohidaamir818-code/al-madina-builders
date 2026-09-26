import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConstructionHero } from "@/components/construction/ConstructionHero";
import { ProjectsBoard } from "@/components/construction/ProjectsBoard";
import { DreamHomeBanner } from "@/components/construction/DreamHomeBanner";
import { StepsSection } from "@/components/construction/StepsSection";
import { ServiceCard } from "@/components/construction/ServiceCard";
import { WhyChooseSection } from "@/components/construction/WhyChooseSection";
import { constructionFooterServices } from "@/data/projects";
import { getPublishedConstructionProjects } from "@/lib/publicProperties";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";

export const metadata: Metadata = {
  title: "Construction Services | Al Madina Builders Multan",
  description:
    "Residential, commercial and industrial construction in Multan — grey structure, finishing, renovation and turnkey projects.",
};

export const dynamic = "force-dynamic";

export default async function ConstructionPage() {
  const [projects, banner] = await Promise.all([
    getPublishedConstructionProjects(),
    getBannerByPageKey("construction").catch(() => null),
  ]);

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <ConstructionHero banner={banner} />
        <ProjectsBoard projects={projects} />
        <div className="mt-12">
          <DreamHomeBanner />
          <StepsSection />
          <ServiceCard />
          <WhyChooseSection />
        </div>
      </main>
      <Footer serviceLinks={constructionFooterServices} />
    </>
  );
}
