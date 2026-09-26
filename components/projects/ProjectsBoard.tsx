"use client";

import { useMemo, useState } from "react";
import { showcaseProjects, type ShowcaseProject } from "@/data/showcaseProjects";
import type { SiteBanner } from "@/lib/admin/bannerStore";
import { Container } from "@/components/ui/Container";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCTABanner } from "@/components/projects/ProjectCTABanner";

function matchesPrice(project: ShowcaseProject, price: string) {
  if (price === "Any Price") return true;
  if (price === "Under PKR 50 Lakh") return project.priceValue < 5000000;
  if (price === "PKR 50 Lakh – 2 Crore") return project.priceValue >= 5000000 && project.priceValue <= 20000000;
  if (price === "PKR 2 – 5 Crore") return project.priceValue > 20000000 && project.priceValue <= 50000000;
  if (price === "PKR 5 Crore+") return project.priceValue > 50000000;
  return true;
}

type ProjectsBoardProps = {
  ctaBanner?: SiteBanner | null;
};

export function ProjectsBoard({ ctaBanner }: ProjectsBoardProps) {
  const [type, setType] = useState("All Types");
  const [location, setLocation] = useState("All Locations");
  const [price, setPrice] = useState("Any Price");
  const [applied, setApplied] = useState({
    type: "All Types",
    location: "All Locations",
    price: "Any Price",
  });

  const filtered = useMemo(() => {
    return showcaseProjects.filter((project) => {
      const typeOk = applied.type === "All Types" || project.type === applied.type;
      const locationOk =
        applied.location === "All Locations" || project.location.includes(applied.location);
      const priceOk = matchesPrice(project, applied.price);
      return typeOk && locationOk && priceOk;
    });
  }, [applied]);

  return (
    <div className="relative z-20 pb-4 pt-8">
      <Container>
        <ProjectFilter
          type={type}
          location={location}
          price={price}
          onType={setType}
          onLocation={setLocation}
          onPrice={setPrice}
          onSubmit={() => setApplied({ type, location, price })}
        />

        <div className="mt-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Featured Projects</p>
          <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Our Ongoing & Upcoming Projects</h2>
          <p className="mt-2 text-sm text-muted">
            Modern living spaces with world-class facilities and strategic locations.
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No projects found</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <ProjectCTABanner banner={ctaBanner} />
        </div>
      </Container>
    </div>
  );
}
