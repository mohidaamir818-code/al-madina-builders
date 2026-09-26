import type { Metadata } from "next";
import { AddEditPropertyForm } from "@/components/admin/AddEditPropertyForm";

export const metadata: Metadata = {
  title: "Add House / Property",
  robots: { index: false, follow: false },
};

export default function AdminAddHousePage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <AddEditPropertyForm mode="add" />
    </>
  );
}
