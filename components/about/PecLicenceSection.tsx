import Image from "next/image";
import { Award } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function PecLicenceSection() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded border border-primary px-3 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            Official Licence
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
            Pakistan Engineering Council Licence
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Al Madina Builders &amp; Property Advisor is a PEC-registered constructor (Licence No. 92768, Category C6).
          </p>
        </div>

        <figure className="mx-auto mt-8 max-w-4xl">
          <a
            href="/images/pec-licence.jpg"
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded border border-line bg-[#F8FAF8] shadow-md transition-shadow hover:shadow-lg"
            aria-label="Open PEC licence full size"
          >
            <Image
              src="/images/pec-licence.jpg"
              alt="Pakistan Engineering Council Licence of Pakistani Constructor/Operator for M/s Al Madina Builders and Property Advisor — Licence No. 92768, Category C6"
              width={1200}
              height={1600}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </a>
          <figcaption className="mt-3 text-center text-xs text-muted sm:text-sm">
            Licence No. 92768 · Category C6 · Valid till 30 June 2026 · Click image to enlarge
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
