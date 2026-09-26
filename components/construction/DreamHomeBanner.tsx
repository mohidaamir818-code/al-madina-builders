import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

const consultHref = `https://wa.me/923056767965?text=${encodeURIComponent(
  "Assalam o Alaikum, mujhe construction ke bare mein consultation chahiye",
)}`;

export function DreamHomeBanner() {
  return (
    <section className="bg-mint py-10 lg:py-12">
      <Container>
        <div className="overflow-hidden rounded border border-line bg-white shadow-sm lg:grid lg:grid-cols-[0.9fr_1.4fr]">
          <div className="relative min-h-[220px]">
            <Image
              src="/images/construction-dream-home.jpg"
              alt="Modern custom home built by Al Madina Builders"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="bg-[#0B3B1E] p-6 text-white sm:p-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#F5B301] uppercase">
              Custom Homes | Modern Designs | Lasting Quality
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Build Your Dream Home With Us</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              From concept to completion, we make the process simple, transparent and stress-free.
            </p>
            <a
              href={consultHref}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover"
            >
              Request a Free Consultation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
