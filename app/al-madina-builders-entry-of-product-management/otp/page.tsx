import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpVerifyPage } from "@/components/admin/OtpVerifyPage";
import { ADMIN_BASE, ADMIN_OTP_COOKIE } from "@/lib/admin/constants";
import { getSessionFromCookies } from "@/lib/admin/cookies";
import { cookies } from "next/headers";
import { verifyOtpPendingToken } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin OTP",
  robots: { index: false, follow: false },
};

export default async function AdminOtpRoute() {
  const session = await getSessionFromCookies();
  if (session) redirect(`${ADMIN_BASE}/dashboard`);

  const jar = await cookies();
  const pending = jar.get(ADMIN_OTP_COOKIE)?.value;
  const valid = pending ? await verifyOtpPendingToken(pending) : null;
  if (!valid) redirect(ADMIN_BASE);

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <OtpVerifyPage />
    </>
  );
}
