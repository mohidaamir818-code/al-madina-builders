import Image from "next/image";
import Link from "next/link";
import { Hammer, Home, Paintbrush, RefreshCw, type LucideIcon } from "lucide-react";
import { constructionServices } from "@/data/projects";
import { Container } from "@/components/ui/Container";

const icons: Record<(typeof constructionServices)[number]["icon"], LucideIcon> = {
  house: Home,
  structure: Hammer,
  interior: Paintbrush,
  renovate: RefreshCw,
};

export function ServiceCard() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <Container>
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Our Construction Services</p>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Quality Construction for Every Need</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {constructionServices.map((service) => {
            const Icon = icons[service.icon];
            return (
              <article
                key={service.id}
                className="overflow-hidden rounded border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-ink">{service.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{service.description}</p>
                  <Link href={`/construction#${service.id}`} className="mt-3 inline-flex text-xs font-semibold text-primary">
                    Learn More →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
