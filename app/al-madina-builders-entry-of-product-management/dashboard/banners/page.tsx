import { AdminBannersPage } from "@/components/admin/AdminBannersPage";
import { listSiteBanners } from "@/lib/admin/bannerStore";

export const dynamic = "force-dynamic";

export default async function AdminBannersRoute() {
  const banners = await listSiteBanners().catch(() => []);
  return <AdminBannersPage initialBanners={banners} />;
}
