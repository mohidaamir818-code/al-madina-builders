import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_BASE, ADMIN_COOKIE, ADMIN_OTP_COOKIE } from "@/lib/admin/constants";
import { verifySessionToken } from "@/lib/admin/session";

const PROTECTED_PREFIXES = [
  `${ADMIN_BASE}/dashboard`,
  `${ADMIN_BASE}/add-property`,
  `${ADMIN_BASE}/edit-property`,
];

function clearSession(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_OTP_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Opening the login entry URL always clears old session → email/password required again
  if (pathname === ADMIN_BASE || pathname === `${ADMIN_BASE}/`) {
    return clearSession(NextResponse.next());
  }

  const needsAuth = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return clearSession(NextResponse.redirect(new URL(ADMIN_BASE, request.url)));
  }

  try {
    const session = await verifySessionToken(token);
    if (!session) {
      return clearSession(NextResponse.redirect(new URL(ADMIN_BASE, request.url)));
    }
  } catch {
    return clearSession(NextResponse.redirect(new URL(ADMIN_BASE, request.url)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/al-madina-builders-entry-of-product-management",
    "/al-madina-builders-entry-of-product-management/",
    "/al-madina-builders-entry-of-product-management/dashboard",
    "/al-madina-builders-entry-of-product-management/dashboard/:path*",
    "/al-madina-builders-entry-of-product-management/add-property",
    "/al-madina-builders-entry-of-product-management/add-property/:path*",
    "/al-madina-builders-entry-of-product-management/edit-property/:path*",
  ],
};
