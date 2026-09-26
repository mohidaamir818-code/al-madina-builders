import { getAdminEmail } from "@/lib/admin/auth";
import { sendMail } from "@/lib/mail";

/**
 * Email delivery for admin OTP.
 * Uses shared mailer (RESEND_* or SMTP_*).
 * If nothing is configured, OTP is logged in development via sendMail console fallback.
 */
export async function sendAdminOtpEmail(otp: string) {
  const to = getAdminEmail();
  if (!to) throw new Error("ADMIN_EMAIL is not configured.");

  const subject = "Al Madina Builders — Admin login code";
  const text = `Your admin verification code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0 0 8px;color:#0B3B1E;font-weight:700;font-size:16px">Al Madina Builders & Property Advisor</p>
      <p style="margin:0 0 16px;color:#374151;font-size:14px">Your admin verification code is:</p>
      <p style="margin:0 0 16px;font-size:28px;font-weight:700;letter-spacing:6px;color:#0B3B1E">${otp}</p>
      <p style="margin:0;color:#6b7280;font-size:12px">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `;

  return sendMail({ to, subject, text, html });
}
