import { redirect } from "next/navigation";
import { ADMIN_BASE } from "@/lib/admin/constants";

export default function LegacyAddRedirect() {
  redirect(`${ADMIN_BASE}/add-property`);
}
