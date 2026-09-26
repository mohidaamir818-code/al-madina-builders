import { site } from "@/data/site";
import { sendMail } from "@/lib/mail";

export type ContactInquiry = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  source?: string;
  propertyTitle?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Email buyer inquiry to the public business inbox (not WhatsApp). */
export async function sendContactInquiryEmail(inquiry: ContactInquiry) {
  const to = site.email;
  const source = inquiry.source || "Website contact form";
  const subject = inquiry.propertyTitle
    ? `New inquiry: ${inquiry.propertyTitle}`
    : `New website message from ${inquiry.name}`;

  const lines = [
    `New buyer message from ${site.shortName} website`,
    ``,
    `Source: ${source}`,
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    inquiry.email ? `Email: ${inquiry.email}` : null,
    inquiry.service ? `Service / Interest: ${inquiry.service}` : null,
    inquiry.propertyTitle ? `Property: ${inquiry.propertyTitle}` : null,
    ``,
    `Message:`,
    inquiry.message,
  ].filter((line): line is string => line !== null);

  const text = lines.join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0 0 8px;color:#0B3B1E;font-weight:700;font-size:16px">${escapeHtml(site.name)}</p>
      <p style="margin:0 0 16px;color:#374151;font-size:14px">New buyer message (${escapeHtml(source)})</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px">Name</td><td style="padding:6px 0">${escapeHtml(inquiry.name)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${escapeHtml(inquiry.phone)}</td></tr>
        ${inquiry.email ? `<tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${escapeHtml(inquiry.email)}</td></tr>` : ""}
        ${inquiry.service ? `<tr><td style="padding:6px 0;color:#6b7280">Interest</td><td style="padding:6px 0">${escapeHtml(inquiry.service)}</td></tr>` : ""}
        ${inquiry.propertyTitle ? `<tr><td style="padding:6px 0;color:#6b7280">Property</td><td style="padding:6px 0">${escapeHtml(inquiry.propertyTitle)}</td></tr>` : ""}
      </table>
      <p style="margin:16px 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Message</p>
      <p style="margin:0;white-space:pre-wrap;color:#111827;font-size:14px;line-height:1.6">${escapeHtml(inquiry.message)}</p>
    </div>
  `;

  return sendMail({
    to,
    subject,
    text,
    html,
    replyTo: inquiry.email || undefined,
  });
}
