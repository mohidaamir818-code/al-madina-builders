import { redirect } from "next/navigation";
import { getConstructionProjectById } from "@/lib/publicProperties";

type Props = {
  params: Promise<{ id: string }>;
};

/** Old /construction/[id] links redirect to the real property detail page. */
export default async function ConstructionDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getConstructionProjectById(id);
  if (project) redirect(`/properties/${project.id}`);
  redirect("/construction");
}
