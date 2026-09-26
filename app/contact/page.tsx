import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { ContactHero } from "@/components/contact-page/ContactHero";
import { ContactCards } from "@/components/contact-page/ContactCards";
import { ContactForm } from "@/components/contact-page/ContactForm";
import { OfficeMapSection } from "@/components/contact-page/OfficeMapSection";
import { QuickQuestions } from "@/components/contact-page/QuickQuestions";
import { HelpBanner } from "@/components/contact-page/HelpBanner";
import { getBannerByPageKey } from "@/lib/admin/bannerStore";

export const metadata: Metadata = {
  title: "Contact Us | Al Madina Builders Multan",
  description:
    "Get in touch with Al Madina Builders & Property Advisor in Multan for property dealing, house maps and construction guidance.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const banner = await getBannerByPageKey("contact").catch(() => null);

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4]">
        <ContactHero banner={banner} />
        <ContactCards />
        <Container className="mt-8 space-y-8 pb-4 lg:mt-10 lg:space-y-10">
          <ContactForm />
          <OfficeMapSection />
        </Container>
        <QuickQuestions />
        <HelpBanner />
      </main>
      <Footer />
    </>
  );
}
