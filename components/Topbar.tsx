import { MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function Topbar() {
  return (
    <div className="bg-brand text-white">
      <Container className="flex items-center justify-between py-2 text-xs sm:text-sm">
        <p className="hidden font-medium tracking-wide sm:block">{site.tagline}</p>
        <div className="flex w-full items-center justify-center gap-4 sm:w-auto sm:justify-end sm:gap-6">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary-bright" aria-hidden="true" />
            <span>{site.city}</span>
          </span>
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-primary-bright"
          >
            <Phone className="h-3.5 w-3.5 text-primary-bright" aria-hidden="true" />
            <span>{site.phone}</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
