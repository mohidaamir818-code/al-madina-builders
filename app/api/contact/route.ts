import { NextResponse } from "next/server";
import { sendContactInquiryEmail } from "@/lib/contactMail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const service = String(body.service || body.interest || "").trim();
    const message = String(body.message || "").trim();
    const source = String(body.source || "Website contact form").trim();
    const propertyTitle = String(body.propertyTitle || "").trim();

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!/^(\+92|0)?3\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
      return NextResponse.json({ error: "Enter a valid Pakistani mobile number." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "Message should be at least 10 characters." }, { status: 400 });
    }

    await sendContactInquiryEmail({
      name,
      phone,
      email: email || undefined,
      service: service && service !== "Choose an option" ? service : undefined,
      message,
      source,
      propertyTitle: propertyTitle || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to send message.";
    console.error("[contact POST]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
