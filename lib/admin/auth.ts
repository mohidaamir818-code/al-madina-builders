import { readFileSync, existsSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { LOGIN_LOCKOUT_MS, LOGIN_MAX_ATTEMPTS } from "@/lib/admin/constants";

type AttemptState = { count: number; lockedUntil: number };

const loginAttempts = new Map<string, AttemptState>();
const otpResendAt = new Map<string, number>();

const HASH_FILE = path.join(process.cwd(), "data", ".admin-password.hash");

export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

/**
 * Prefer hash file (avoids .env `$` expansion breaking bcrypt hashes).
 * Falls back to ADMIN_PASSWORD_HASH (use $$ for literal $ in .env.local).
 */
export function getPasswordHash() {
  try {
    if (existsSync(HASH_FILE)) {
      const fromFile = readFileSync(HASH_FILE, "utf8").trim();
      if (fromFile.startsWith("$2")) return fromFile;
    }
  } catch {
    /* fall through to env */
  }
  return (process.env.ADMIN_PASSWORD_HASH || "").trim().replace(/^["']|["']$/g, "");
}

export async function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = getAdminEmail();
  const hash = getPasswordHash();
  if (!expectedEmail || !hash) {
    return { ok: false as const, reason: "config" as const };
  }
  if (email.trim().toLowerCase() !== expectedEmail) {
    return { ok: false as const, reason: "invalid" as const };
  }
  const match = await bcrypt.compare(password, hash);
  return match ? ({ ok: true as const } as const) : ({ ok: false as const, reason: "invalid" as const });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 8);
}

export async function verifyOtpHash(otp: string, hash: string) {
  return bcrypt.compare(otp, hash);
}

export function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const state = loginAttempts.get(key);
  if (state && state.lockedUntil > now) {
    const waitSec = Math.ceil((state.lockedUntil - now) / 1000);
    return { allowed: false as const, waitSec };
  }
  if (state && state.lockedUntil <= now && state.count >= LOGIN_MAX_ATTEMPTS) {
    loginAttempts.delete(key);
  }
  return { allowed: true as const };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const prev = loginAttempts.get(key);
  const count = (prev?.lockedUntil && prev.lockedUntil > now ? prev.count : prev?.count || 0) + 1;
  if (count >= LOGIN_MAX_ATTEMPTS) {
    loginAttempts.set(key, { count, lockedUntil: now + LOGIN_LOCKOUT_MS });
    return { locked: true as const, waitSec: Math.ceil(LOGIN_LOCKOUT_MS / 1000) };
  }
  loginAttempts.set(key, { count, lockedUntil: 0 });
  return { locked: false as const, remaining: LOGIN_MAX_ATTEMPTS - count };
}

export function clearLoginFailures(key: string) {
  loginAttempts.delete(key);
}

export function canResendOtp(email: string, cooldownMs: number) {
  const last = otpResendAt.get(email) || 0;
  const wait = last + cooldownMs - Date.now();
  if (wait > 0) return { ok: false as const, waitSec: Math.ceil(wait / 1000) };
  return { ok: true as const };
}

export function markOtpSent(email: string) {
  otpResendAt.set(email, Date.now());
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
