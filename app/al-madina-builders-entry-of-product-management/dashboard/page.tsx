import { AdminDashboardPage } from "@/components/admin/AdminDashboardPage";
import { listAdminProperties } from "@/lib/admin/propertyStore";

export const dynamic = "force-dynamic";

export default async function AdminDashboardRoute() {
  const properties = await listAdminProperties();
  return <AdminDashboardPage initialProperties={properties} />;
}
