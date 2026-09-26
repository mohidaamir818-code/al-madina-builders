import { SignJWT, jwtVerify } from "jose";
import { SESSION_DAYS } from "@/lib/admin/constants";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 characters).");
  }
  return new TextEncoder().encode(secret);
}

export type AdminSessionPayload = {
  sub: string;
  email: string;
};

export async function createSessionToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!email || payload.sub !== "admin") return null;
    return { sub: "admin", email };
  } catch {
    return null;
  }
}

export type OtpPendingPayload = {
  email: string;
  otpHash: string;
  attempts: number;
  exp: number;
};

export async function createOtpPendingToken(data: Omit<OtpPendingPayload, "attempts"> & { attempts?: number }) {
  return new SignJWT({
    email: data.email,
    otpHash: data.otpHash,
    attempts: data.attempts ?? 0,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin-otp")
    .setIssuedAt()
    .setExpirationTime(Math.floor(data.exp / 1000))
    .sign(getSecret());
}

export async function verifyOtpPendingToken(token: string): Promise<OtpPendingPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.sub !== "admin-otp") return null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const otpHash = typeof payload.otpHash === "string" ? payload.otpHash : null;
    const attempts = typeof payload.attempts === "number" ? payload.attempts : 0;
    const exp = typeof payload.exp === "number" ? payload.exp * 1000 : 0;
    if (!email || !otpHash) return null;
    return { email, otpHash, attempts, exp };
  } catch {
    return null;
  }
}
