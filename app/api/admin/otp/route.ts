import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  canResendOtp,
  generateOtpCode,
  hashOtp,
  markOtpSent,
  verifyOtpHash,
} from "@/lib/admin/auth";
import {
  ADMIN_OTP_COOKIE,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
} from "@/lib/admin/constants";
import { clearAuthCookies, sessionCookieOptions, setSessionCookie } from "@/lib/admin/cookies";
import { sendAdminOtpEmail } from "@/lib/admin/email";
import { createOtpPendingToken, verifyOtpPendingToken } from "@/lib/admin/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { otp?: string };
    const otp = (body.otp || "").replace(/\D/g, "");
    if (otp.length !== 6) {
      return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
    }

    const jar = await cookies();
    const pendingToken = jar.get(ADMIN_OTP_COOKIE)?.value;
    if (!pendingToken) {
      return NextResponse.json({ error: "Code expired, please resend" }, { status: 401 });
    }

    const pending = await verifyOtpPendingToken(pendingToken);
    if (!pending || pending.exp < Date.now()) {
      const res = NextResponse.json({ error: "Code expired, please resend" }, { status: 401 });
      res.cookies.set(ADMIN_OTP_COOKIE, "", sessionCookieOptions(0));
      return res;
    }

    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      const res = NextResponse.json({ error: "Too many incorrect codes. Please resend." }, { status: 429 });
      res.cookies.set(ADMIN_OTP_COOKIE, "", sessionCookieOptions(0));
      return res;
    }

    const ok = await verifyOtpHash(otp, pending.otpHash);
    if (!ok) {
      const nextAttempts = pending.attempts + 1;
      const refreshed = await createOtpPendingToken({
        email: pending.email,
        otpHash: pending.otpHash,
        exp: pending.exp,
        attempts: nextAttempts,
      });
      const res = NextResponse.json(
        {
          error: "Invalid verification code.",
          remaining: Math.max(0, OTP_MAX_ATTEMPTS - nextAttempts),
        },
        { status: 401 },
      );
      res.cookies.set(
        ADMIN_OTP_COOKIE,
        refreshed,
        sessionCookieOptions(Math.max(1, Math.floor((pending.exp - Date.now()) / 1000))),
      );
      return res;
    }

    const response = NextResponse.json({ ok: true });
    await setSessionCookie(response, pending.email);
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to verify code." }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const jar = await cookies();
    const pendingToken = jar.get(ADMIN_OTP_COOKIE)?.value;
    if (!pendingToken) {
      return NextResponse.json({ error: "Start login again." }, { status: 401 });
    }
    const pending = await verifyOtpPendingToken(pendingToken);
    if (!pending) {
      return NextResponse.json({ error: "Code expired, please resend" }, { status: 401 });
    }

    const resend = canResendOtp(pending.email, OTP_RESEND_COOLDOWN_MS);
    if (!resend.ok) {
      return NextResponse.json(
        { error: `Resend available in ${resend.waitSec}s.`, waitSec: resend.waitSec },
        { status: 429 },
      );
    }

    const otp = generateOtpCode();
    const otpHash = await hashOtp(otp);
    const exp = Date.now() + OTP_TTL_MS;
    const token = await createOtpPendingToken({ email: pending.email, otpHash, exp, attempts: 0 });

    await sendAdminOtpEmail(otp);
    markOtpSent(pending.email);

    const response = NextResponse.json({ ok: true, message: "A new code has been sent." });
    response.cookies.set(ADMIN_OTP_COOKIE, token, sessionCookieOptions(Math.floor(OTP_TTL_MS / 1000)));
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to resend code.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  return clearAuthCookies(response);
}
