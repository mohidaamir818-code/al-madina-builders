import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddEditPropertyForm } from "@/components/admin/AddEditPropertyForm";
import { getAdminPropertyBySlug } from "@/lib/admin/propertyStore";

export const metadata: Metadata = {
  title: "Edit Property",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ slug: string }> };

export default async function AdminEditPropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getAdminPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <AddEditPropertyForm mode="edit" initial={property} />
    </>
  );
}
