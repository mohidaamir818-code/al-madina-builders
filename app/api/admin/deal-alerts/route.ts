import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";
import { deleteDealSubscriber, listDealSubscribers } from "@/lib/dealAlertStore";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const subscribers = await listDealSubscribers();
    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json({ subscribers: [] });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    const ok = await deleteDealSubscriber(id);
    if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
