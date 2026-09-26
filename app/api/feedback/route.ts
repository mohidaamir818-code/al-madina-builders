import { NextResponse } from "next/server";
import { createFeedback, getPublishedFeedbacks } from "@/lib/feedbackStore";

export async function GET() {
  try {
    const feedbacks = await getPublishedFeedbacks();
    return NextResponse.json({ feedbacks });
  } catch {
    return NextResponse.json({ feedbacks: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name || "").trim();
    const text = String(body.text || "").trim();
    const rating = Number(body.rating) || 5;

    if (!name || !text) {
      return NextResponse.json({ error: "Name and review are required." }, { status: 400 });
    }

    const feedback = await createFeedback({ name, text, rating });
    return NextResponse.json({ feedback }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to submit feedback.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
