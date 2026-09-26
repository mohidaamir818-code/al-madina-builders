import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";

export default function PropertyNotFound() {
  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4] py-16">
        <Container className="max-w-xl rounded border border-line bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">404</p>
          <h1 className="mt-2 text-2xl font-bold text-ink">Property not found</h1>
          <p className="mt-3 text-sm text-muted">
            Yeh property listing maujood nahi hai ya link galat hai. Properties page se dobara choose karein.
          </p>
          <Link
            href="/properties"
            className="mt-6 inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Back to Properties
          </Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}
