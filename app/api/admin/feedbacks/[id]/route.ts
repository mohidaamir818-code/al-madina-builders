import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { deleteFeedback, setFeedbackPublished } from "@/lib/feedbackStore";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.isPublished !== "boolean") {
      return NextResponse.json({ error: "isPublished boolean required." }, { status: 400 });
    }
    const feedback = await setFeedbackPublished(id, body.isPublished);
    if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ feedback });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to update feedback.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const ok = await deleteFeedback(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
