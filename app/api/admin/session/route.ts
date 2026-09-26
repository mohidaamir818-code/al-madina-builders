import { NextResponse } from "next/server";
import { clearAuthCookies, requireAdminSession } from "@/lib/admin/cookies";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email: session.email });
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearAuthCookies(response);
}
