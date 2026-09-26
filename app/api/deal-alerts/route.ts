import { NextResponse } from "next/server";
import { createDealSubscriber } from "@/lib/dealAlertStore";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email || "").trim();
    const whatsapp = String(body.whatsapp || body.phone || "").trim();

    if (!email || !whatsapp) {
      return NextResponse.json({ error: "Email and WhatsApp number are required." }, { status: 400 });
    }

    const { subscriber, alreadyRegistered } = await createDealSubscriber({ email, whatsapp });
    return NextResponse.json(
      {
        subscriber: { id: subscriber.id, email: subscriber.email, whatsapp: subscriber.whatsapp },
        alreadyRegistered,
        message: alreadyRegistered
          ? "You are already registered for deal alerts."
          : "Registered successfully. We will notify you about new deals and houses.",
      },
      { status: alreadyRegistered ? 200 : 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to register.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
