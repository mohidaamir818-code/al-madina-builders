import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_OTP_COOKIE,
  SESSION_DAYS,
} from "@/lib/admin/constants";
import { createSessionToken, verifySessionToken } from "@/lib/admin/session";

const isProd = process.env.NODE_ENV === "production";

export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function setSessionCookie(response: NextResponse, email: string) {
  const token = await createSessionToken(email);
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60));
  response.cookies.set(ADMIN_OTP_COOKIE, "", sessionCookieOptions(0));
  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", sessionCookieOptions(0));
  response.cookies.set(ADMIN_OTP_COOKIE, "", sessionCookieOptions(0));
  return response;
}

export async function getSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const session = await getSessionFromCookies();
  if (!session) return null;
  return session;
}
