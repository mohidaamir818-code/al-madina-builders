import type { Metadata } from "next";
import { AddInteriorForm } from "@/components/admin/AddInteriorForm";

export const metadata: Metadata = {
  title: "Add Interior Design",
  robots: { index: false, follow: false },
};

export default function AdminAddInteriorPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <AddInteriorForm />
    </>
  );
}
