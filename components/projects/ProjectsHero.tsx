import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

const badges = [
  { label: "Quality Construction", sub: "Trusted build", icon: Building2 },
  { label: "Trusted Developers", sub: "Verified team", icon: BadgeCheck },
  { label: "Prime Locations", sub: "Best societies", icon: MapPin },
  { label: "Modern Facilities", sub: "Smart living", icon: Sparkles },
];

export function ProjectsHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B3B1E]">
      <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
        <Image
          src="/images/projects-hero.jpg"
          alt="Modern house showcasing Al Madina projects"
          fill
          priority
          sizes="48vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B1E] via-[#0B3B1E]/70 to-transparent" />
      </div>
      <Container className="relative z-10 py-10 lg:min-h-[300px] lg:py-14">
        <div className="max-w-xl text-white">
          <p className="text-xs text-white/70">
            <Link href="/" className="hover:text-primary-bright">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="text-primary-bright">Projects</span>
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[52px]">
            OUR
            <span className="mt-1 block text-primary-bright">PROJECTS</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/80 sm:text-base">
            Explore our latest residential, commercial and mixed-use projects. Find the perfect investment for your
            future.
          </p>
          <ul className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-5">
            {badges.map(({ label, sub, icon: Icon }) => (
              <li key={label} className="inline-flex items-center gap-2 text-xs">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="text-white/70">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded lg:hidden">
          <Image
            src="/images/projects-hero.jpg"
            alt="Modern house showcasing Al Madina projects"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
