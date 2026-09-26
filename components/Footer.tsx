import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { FooterQuickLinks } from "@/components/FooterQuickLinks";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.23-1.63a11.9 11.9 0 0 0 5.82 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.42ZM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.7.97.99-3.6-.23-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.11 1.03 6.97 2.9a9.82 9.82 0 0 1 2.89 6.97c0 5.44-4.43 9.83-9.9 9.83Zm5.42-7.38c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "WhatsApp", href: `https://wa.me/${site.whatsapp}`, icon: WhatsAppIcon },
];

export function Footer({
  serviceLinks,
}: {
  serviceLinks?: ReadonlyArray<{ title: string; href: string }>;
}) {
  const footerServices = serviceLinks ?? services.map((service) => ({ title: service.title, href: "/contact" }));
  return (
    <footer className="bg-brand text-white">
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <a href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/logo-al-madina.png"
              alt="Al Madina Builders & Property Advisor logo"
              width={44}
              height={44}
              className="h-11 w-11"
            />
            <span className="text-xs leading-tight font-bold tracking-wide uppercase">
              Al Madina Builders &
              <span className="block text-primary-bright">Property Advisor</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
            Construction, professional house maps and property dealing across Multan&apos;s major housing societies.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Quick Links</h3>
          <FooterQuickLinks />
        </div>

        <div>
          <h3 className="text-sm font-semibold">Our Services</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {footerServices.map((service) => (
              <li key={service.title}>
                <a href={service.href} className="transition-colors duration-200 hover:text-primary-bright">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h3 className="text-sm font-semibold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-bright" aria-hidden="true" />
              <a href={`tel:${site.phoneTel}`} className="hover:text-primary-bright">
                {site.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-bright" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="min-w-0 break-all hover:text-primary-bright">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary-bright" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-primary"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-white/60 sm:flex-row sm:text-left">
          <p>© 2025 Al Madina Builders & Property Advisor. All Rights Reserved.</p>
          <p>{site.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}
