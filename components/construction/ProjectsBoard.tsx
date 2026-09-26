"use client";

import { useMemo, useState } from "react";
import { buildProjectLocationOptions, type ConstructionProject } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { ConstructionSearch } from "@/components/construction/ConstructionSearch";
import { ProjectCard } from "@/components/construction/ProjectCard";
import { BuildHelpCard } from "@/components/construction/BuildHelpCard";

type ProjectsBoardProps = {
  projects: ConstructionProject[];
};

export function ProjectsBoard({ projects }: ProjectsBoardProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [location, setLocation] = useState("All Locations");
  const [status, setStatus] = useState("All Status");
  const [applied, setApplied] = useState({
    query: "",
    type: "All Types",
    location: "All Locations",
    status: "All Status",
  });
  const [saved, setSaved] = useState<string[]>([]);

  const locationChoices = useMemo(() => buildProjectLocationOptions(projects), [projects]);

  const filtered = useMemo(() => {
    const needle = applied.query.trim().toLowerCase();
    return projects.filter((item) => {
      const text = `${item.title} ${item.location} ${item.type}`.toLowerCase();
      const queryOk = !needle || text.includes(needle);
      const typeOk = applied.type === "All Types" || item.type === applied.type;
      const locationOk =
        applied.location === "All Locations" ||
        item.location.toLowerCase().includes(applied.location.toLowerCase());
      const statusOk = applied.status === "All Status" || item.status === applied.status;
      return queryOk && typeOk && locationOk && statusOk;
    });
  }, [applied, projects]);

  return (
    <div className="relative z-20 -mt-8">
      <Container>
        <ConstructionSearch
          query={query}
          type={type}
          location={location}
          status={status}
          locations={locationChoices}
          onQuery={setQuery}
          onType={(value) => {
            setType(value);
            setApplied((current) => ({ ...current, type: value }));
          }}
          onLocation={(value) => {
            setLocation(value);
            setApplied((current) => ({ ...current, location: value }));
          }}
          onStatus={(value) => {
            setStatus(value);
            setApplied((current) => ({ ...current, status: value }));
          }}
          onSubmit={() => setApplied({ query, type, location, status })}
        />

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Our Construction Projects</p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Ongoing & Completed Projects</h2>
            <p className="mt-2 text-sm text-muted">
              Explore our latest construction projects, delivered with quality, precision and on time.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  saved={saved.includes(project.id)}
                  onToggleSave={(id) =>
                    setSaved((current) =>
                      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
                    )
                  }
                />
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="mt-8 rounded border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
                {projects.length === 0
                  ? "Abhi koi construction project live nahi hai. Admin panel se property add karein."
                  : "No projects match your search. Try another filter."}
              </p>
            ) : null}
          </div>
          <BuildHelpCard />
        </div>
      </Container>
    </div>
  );
}
