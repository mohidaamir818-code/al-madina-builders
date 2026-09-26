import { NextResponse } from "next/server";
import {
  canResendOtp,
  checkLoginRateLimit,
  clearLoginFailures,
  generateOtpCode,
  hashOtp,
  markOtpSent,
  recordLoginFailure,
  verifyAdminCredentials,
} from "@/lib/admin/auth";
import { ADMIN_OTP_COOKIE, OTP_RESEND_COOLDOWN_MS, OTP_TTL_MS } from "@/lib/admin/constants";
import { sessionCookieOptions } from "@/lib/admin/cookies";
import { sendAdminOtpEmail } from "@/lib/admin/email";
import { createOtpPendingToken } from "@/lib/admin/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateKey = `${ip}:${email.toLowerCase()}`;
    const rate = checkLoginRateLimit(rateKey);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${rate.waitSec} seconds.` },
        { status: 429 },
      );
    }

    const result = await verifyAdminCredentials(email, password);
    if (!result.ok) {
      if (result.reason === "config") {
        return NextResponse.json(
          { error: "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.local." },
          { status: 503 },
        );
      }
      const fail = recordLoginFailure(rateKey);
      if (fail.locked) {
        return NextResponse.json(
          { error: `Too many attempts. Locked for ${fail.waitSec} seconds.` },
          { status: 429 },
        );
      }
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    clearLoginFailures(rateKey);

    const resend = canResendOtp(email.toLowerCase(), OTP_RESEND_COOLDOWN_MS);
    if (!resend.ok) {
      return NextResponse.json(
        { error: `Please wait ${resend.waitSec}s before requesting another code.` },
        { status: 429 },
      );
    }

    const otp = generateOtpCode();
    const otpHash = await hashOtp(otp);
    const exp = Date.now() + OTP_TTL_MS;
    const pending = await createOtpPendingToken({
      email: email.toLowerCase(),
      otpHash,
      exp,
    });

    try {
      await sendAdminOtpEmail(otp);
      markOtpSent(email.toLowerCase());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP email.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const response = NextResponse.json({
      ok: true,
      message: "Verification code sent to your email.",
      expiresInSec: Math.floor(OTP_TTL_MS / 1000),
    });
    response.cookies.set(ADMIN_OTP_COOKIE, pending, sessionCookieOptions(Math.floor(OTP_TTL_MS / 1000)));
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to process login." }, { status: 500 });
  }
}
