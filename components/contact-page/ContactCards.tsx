import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { contactHours } from "@/data/contact";
import { Container } from "@/components/ui/Container";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5 fill-current"} aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.23-1.63a11.9 11.9 0 0 0 5.82 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.42ZM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.7.97.99-3.6-.23-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.11 1.03 6.97 2.9a9.82 9.82 0 0 1 2.89 6.97c0 5.44-4.43 9.83-9.9 9.83Zm5.42-7.38c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

const cards = [
  {
    title: "Call Us",
    primary: site.phone,
    secondary: contactHours,
    href: `tel:03056767965`,
    icon: Phone,
  },
  {
    title: "WhatsApp",
    primary: "Chat Now",
    secondary: "Quick Response",
    href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Assalam o Alaikum, mujhe guidance chahiye.")}`,
    icon: WhatsAppIcon,
    external: true,
  },
  {
    title: "Email Us",
    primary: site.email,
    secondary: "We reply within 24 hours",
    href: `mailto:${site.email}`,
    icon: Mail,
  },
  {
    title: "Our Office",
    primary: site.city,
    secondary: "Visit us for more details",
    href: "https://maps.google.com/?q=Aamir+Hussain+Aura,+Multan,+Pakistan",
    icon: MapPin,
    external: true,
  },
] as const;

export function ContactCards() {
  return (
    <Container className="relative z-20 -mt-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.href}
              target={"external" in card && card.external ? "_blank" : undefined}
              rel={"external" in card && card.external ? "noreferrer" : undefined}
              className="rounded border border-line bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-ink">{card.title}</h3>
              <p className="mt-1 break-all text-xs font-semibold text-primary sm:text-sm">{card.primary}</p>
              <p className="mt-1 text-[11px] text-muted sm:text-xs">{card.secondary}</p>
            </a>
          );
        })}
      </div>
    </Container>
  );
}
