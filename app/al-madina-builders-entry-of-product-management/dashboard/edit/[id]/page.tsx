import { redirect } from "next/navigation";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { getAdminProperty } from "@/lib/admin/propertyStore";

type Props = { params: Promise<{ id: string }> };

export default async function LegacyEditRedirect({ params }: Props) {
  const { id } = await params;
  const property = await getAdminProperty(id);
  if (property) redirect(`${ADMIN_BASE}/edit-property/${property.slug}`);
  redirect(`${ADMIN_BASE}/dashboard`);
}
