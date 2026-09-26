import nodemailer from "nodemailer";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

/**
 * Shared outbound email (SMTP or Resend).
 * Uses the same env as admin OTP: RESEND_* or SMTP_*.
 */
export async function sendMail(input: SendMailInput) {
  const from =
    process.env.CONTACT_FROM ||
    process.env.SMTP_FROM ||
    process.env.RESEND_FROM ||
    "Al Madina Website <onboarding@resend.dev>";

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend failed: ${body}`);
    }
    return { channel: "resend" as const };
  }

  const host = process.env.SMTP_HOST;
  if (host) {
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
    if (!user || !pass) {
      throw new Error("SMTP_USER and SMTP_PASS are required when SMTP_HOST is set.");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { channel: "smtp" as const };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[mail:dev]", {
      to: input.to,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo,
    });
    return { channel: "console" as const };
  }

  throw new Error("No email provider configured. Set RESEND_API_KEY or SMTP_HOST.");
}
