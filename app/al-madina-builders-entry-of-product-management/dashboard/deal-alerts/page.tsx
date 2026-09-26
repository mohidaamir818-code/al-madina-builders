import { AdminDealAlertsPage } from "@/components/admin/AdminDealAlertsPage";
import { listDealSubscribers } from "@/lib/dealAlertStore";

export const dynamic = "force-dynamic";

export default async function AdminDealAlertsRoute() {
  const subscribers = await listDealSubscribers().catch(() => []);
  return <AdminDealAlertsPage initialSubscribers={subscribers} />;
}
