import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { contactHoursLong } from "@/data/contact";

export function OfficeMapSection() {
  const directions =
    site.mapsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${site.mapLat},${site.mapLng}`;

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-h-[280px] overflow-hidden rounded border border-line bg-white shadow-sm lg:min-h-[360px]">
        <iframe
          title="Al Madina Builders office location in Multan"
          src={site.mapEmbed}
          className="h-full min-h-[280px] w-full border-0 lg:min-h-[360px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="rounded border border-line bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-ink">Our Office Location</h2>
        <ul className="mt-5 space-y-4 text-sm text-muted">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{site.address}</span>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <a href={`tel:${site.phoneTel}`} className="hover:text-primary">
              {site.phone}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <a href={`mailto:${site.email}`} className="break-all hover:text-primary">
              {site.email}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{contactHoursLong}</span>
          </li>
        </ul>
        <a
          href={directions}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded bg-[#0B3B1E] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#072816]"
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}
