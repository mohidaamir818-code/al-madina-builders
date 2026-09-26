import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/cookies";

const STORE = path.join(process.cwd(), "data", "admin-select-options.json");

async function readOptions(): Promise<Record<string, string[]>> {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    return JSON.parse(raw) as Record<string, string[]>;
  } catch {
    return {};
  }
}

async function writeOptions(data: Record<string, string[]>) {
  await fs.writeFile(STORE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ options: await readOptions() });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as { key?: string; option?: string };
    const key = String(body.key || "").trim();
    const option = String(body.option || "").trim();
    if (!key || !option) {
      return NextResponse.json({ error: "key and option required" }, { status: 400 });
    }
    const all = await readOptions();
    const list = all[key] || [];
    if (!list.some((o) => o.toLowerCase() === option.toLowerCase())) {
      list.push(option);
      all[key] = list;
      await writeOptions(all);
    }
    return NextResponse.json({ ok: true, options: all[key] });
  } catch {
    return NextResponse.json({ error: "Unable to save option." }, { status: 500 });
  }
}
