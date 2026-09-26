import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { aboutConsultMessage } from "@/data/about";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.23-1.63a11.9 11.9 0 0 0 5.82 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.42ZM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.7.97.99-3.6-.23-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.11 1.03 6.97 2.9a9.82 9.82 0 0 1 2.89 6.97c0 5.44-4.43 9.83-9.9 9.83Zm5.42-7.38c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(aboutConsultMessage)}`;

export function WhyChooseBanner() {
  return (
    <section className="bg-white py-10 lg:py-14">
      <Container>
        <div className="overflow-hidden rounded bg-[#0B3B1E] text-white shadow-sm lg:grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-5 sm:p-8">
            <span className="inline-flex rounded border border-primary-bright px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-bright uppercase">
              Why Choose Us
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">More Than Just a Real Estate Company</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
              We are your partners in every step of your property journey. From buying and selling to construction and
              investment, we are here to make the process simple, transparent and successful.
            </p>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded border border-white px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white hover:text-brand sm:w-auto"
            >
              <WhatsAppIcon />
              Contact Us on WhatsApp
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="relative min-h-[240px] lg:min-h-[280px]">
            <Image
              src="/images/listing-house-dusk.jpg"
              alt="Modern home representing Al Madina property journey"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B1E]/40 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#0B3B1E]/35" />
          </div>
        </div>
      </Container>
    </section>
  );
}
