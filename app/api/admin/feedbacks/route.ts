import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { listFeedbacks } from "@/lib/feedbackStore";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const feedbacks = await listFeedbacks();
  const pending = feedbacks.filter((f) => !f.isPublished).length;
  return NextResponse.json({ feedbacks, pending });
}
