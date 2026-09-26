import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectsBoard } from "@/components/projects/ProjectsBoard";
import { TrustStrip } from "@/components/projects/TrustStrip";

export const metadata: Metadata = {
  title: "Our Projects | Al Madina Builders Multan",
  description:
    "Explore ongoing and upcoming residential and commercial projects by Al Madina Builders in Multan.",
};

export default function ProjectsPage() {
  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <ProjectsHero />
        <ProjectsBoard />
        <TrustStrip />
      </main>
      <Footer />
    </>
  );
}
