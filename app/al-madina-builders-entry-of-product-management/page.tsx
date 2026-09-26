import type { Metadata } from "next";
import { AdminLoginPage } from "@/components/admin/AdminLoginPage";

export const metadata: Metadata = {
  title: "Admin Entry",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

/** Always show login form — never auto-open dashboard. */
export default function AdminEntryPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <AdminLoginPage />
    </>
  );
}
