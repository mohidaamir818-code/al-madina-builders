import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin } from "lucide-react";
import type { ShowcaseProject } from "@/data/showcaseProjects";

export function ProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <article className="overflow-hidden rounded border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10]">
        <Image
          src={project.image}
          alt={`${project.title} project`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 rounded bg-[#0B3B1E] px-2.5 py-1 text-[11px] font-semibold text-white">
          {project.status}
        </span>
        <p className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded bg-black/55 px-2 py-1 text-[11px] text-white">
          <MapPin className="h-3 w-3 text-primary-bright" aria-hidden="true" />
          {project.location}
        </p>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-ink">{project.title}</h3>
        <ul className="mt-3 space-y-1.5 text-xs text-muted">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-lg font-bold text-primary">{project.price}</p>
        <Link
          href={`/projects/${project.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded bg-[#0B3B1E] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#072816]"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
