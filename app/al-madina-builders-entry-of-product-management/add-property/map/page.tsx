import type { Metadata } from "next";
import { AddHouseMapForm } from "@/components/admin/AddHouseMapForm";

export const metadata: Metadata = {
  title: "Add House Map",
  robots: { index: false, follow: false },
};

export default function AdminAddMapPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <AddHouseMapForm />
    </>
  );
}
