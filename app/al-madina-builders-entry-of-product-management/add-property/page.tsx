import type { Metadata } from "next";
import { ListingTypeChooser } from "@/components/admin/ListingTypeChooser";

export const metadata: Metadata = {
  title: "Choose Listing Type",
  robots: { index: false, follow: false },
};

export default function AdminAddListingChooserPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <ListingTypeChooser />
    </>
  );
}
