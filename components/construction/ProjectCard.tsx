"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Building2, Heart, MapPin, Maximize2, Store } from "lucide-react";
import type { ConstructionProject } from "@/data/projects";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: ConstructionProject;
  saved: boolean;
  onToggleSave: (id: string) => void;
};

export function ProjectCard({ project, saved, onToggleSave }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3]">
        <Image
          src={project.image}
          alt={`${project.title} construction project`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
          {project.status}
        </span>
        <button
          type="button"
          onClick={() => onToggleSave(project.id)}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm"
          aria-label={saved ? "Remove from saved" : "Save project"}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-ink">{project.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {project.location}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {project.type}
        </p>
        <ul className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
          <li className="inline-flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {project.area}
          </li>
          {project.beds ? (
            <li className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {project.beds} Beds
            </li>
          ) : null}
          {project.baths ? (
            <li className="inline-flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {project.baths} Baths
            </li>
          ) : null}
          {project.shops ? (
            <li className="inline-flex items-center gap-1">
              <Store className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {project.shops} Shops
            </li>
          ) : null}
          {project.extra ? <li>{project.extra}</li> : null}
        </ul>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-primary">{project.progress}%</span>
        </div>
        <Link
          href={`/properties/${project.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded bg-primary text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
