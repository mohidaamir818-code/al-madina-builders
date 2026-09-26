import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GiveFeedbackForm } from "@/components/feedback/GiveFeedbackForm";

export const metadata: Metadata = {
  title: "Give Feedback | Al Madina Builders Multan",
  description: "Share your experience with Al Madina Builders & Property Advisor.",
};

export default function GiveFeedbackPage() {
  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="min-h-[70vh] bg-[#F3F6F4]">
        <GiveFeedbackForm />
      </main>
      <Footer />
    </>
  );
}
