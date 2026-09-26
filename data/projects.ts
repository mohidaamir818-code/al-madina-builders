export type ProjectStatus = "Ongoing" | "Completed";
export type ProjectType = "Residential" | "Commercial" | "Industrial";

export type ConstructionProject = {
  id: string;
  title: string;
  status: ProjectStatus;
  location: string;
  type: ProjectType;
  area: string;
  beds?: number;
  baths?: number;
  shops?: number;
  extra?: string;
  progress: number;
  image: string;
};

/** Static demos removed — use getPublishedConstructionProjects() from lib/publicProperties */
export const constructionProjects: ConstructionProject[] = [];

export const constructionConsultMessage =
  "Assalam o Alaikum, mujhe construction ke bare mein consultation chahiye";

export const projectTypeOptions = ["All Types", "Residential", "Commercial", "Industrial"] as const;

export const BASE_PROJECT_LOCATIONS = [
  "DHA Multan",
  "Royal Orchard",
  "Buch Villas",
  "Wapda Town",
] as const;

export const projectLocationOptions = ["All Locations", ...BASE_PROJECT_LOCATIONS] as const;

export function buildProjectLocationOptions(projects: Pick<ConstructionProject, "location">[]): string[] {
  const base = [...BASE_PROJECT_LOCATIONS];
  const custom = new Set<string>();

  for (const item of projects) {
    const loc = (item.location || "").trim();
    if (!loc) continue;
    const matchedBase = base.find((name) => loc.toLowerCase().includes(name.toLowerCase()));
    if (matchedBase) continue;
    const society = loc.split(",")[0]?.trim();
    if (society) custom.add(society);
  }

  return ["All Locations", ...base, ...[...custom].sort((a, b) => a.localeCompare(b))];
}

export const projectStatusOptions = ["All Status", "Ongoing", "Completed"] as const;

export const constructionFooterServices = [
  { title: "Residential Construction", href: "/construction" },
  { title: "Commercial Construction", href: "/construction" },
  { title: "Industrial Construction", href: "/construction" },
  { title: "Renovation & Remodeling", href: "/construction" },
  { title: "Turnkey Projects", href: "/construction" },
];

export const constructionServices = [
  {
    id: "complete-house",
    title: "Complete House Construction",
    description: "End-to-end construction services for your dream home.",
    image: "/images/listing-house-dusk.jpg",
    icon: "house",
  },
  {
    id: "grey-structure",
    title: "Grey Structure",
    description: "Strong foundation for a lasting future.",
    image: "/images/construction-frame.jpg",
    icon: "structure",
  },
  {
    id: "finishing-interior",
    title: "Finishing & Interior",
    description: "Beautiful interiors, modern finishes, perfect look.",
    image: "/images/service-interior.jpg",
    icon: "interior",
  },
  {
    id: "renovation",
    title: "Renovation & Remodeling",
    description: "Upgrade your space, add more value.",
    image: "/images/service-renovation.jpg",
    icon: "renovate",
  },
] as const;
