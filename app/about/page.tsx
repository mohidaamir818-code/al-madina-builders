import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { CompanyIntroSection } from "@/components/about/CompanyIntroSection";
import { PecLicenceSection } from "@/components/about/PecLicenceSection";
import { DirectorSection } from "@/components/about/DirectorSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { WhyChooseBanner } from "@/components/about/WhyChooseBanner";
import { CTAStrip } from "@/components/about/CTAStrip";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";

export const metadata: Metadata = {
  title: "About Us | Al Madina Builders Multan",
  description:
    "Learn about Al Madina Builders & Property Advisor — Multan's trusted partner for property dealing, house maps and construction, led by Malik Aamir Hussain.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [banner, whyBanner] = await Promise.all([
    getBannerByPageKey("about").catch(() => null),
    getBannerByPageKey("about-why").catch(() => null),
  ]);

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <AboutHero banner={banner} />
        <CompanyIntroSection />
        <PecLicenceSection />
        <DirectorSection />
        <ValuesSection />
        <WhyChooseBanner banner={whyBanner} />
        <CTAStrip />
      </main>
      <Footer />
    </>
  );
}
