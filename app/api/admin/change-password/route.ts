import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPasswordHash, verifyAdminCredentials } from "@/lib/admin/auth";
import { requireAdminSession } from "@/lib/admin/cookies";

/**
 * Updates ADMIN_PASSWORD_HASH inside .env.local when possible.
 * For production, set the hash in your host env and restart — file write may not apply.
 */
async function persistPasswordHash(hash: string) {
  const hashPath = path.join(process.cwd(), "data", ".admin-password.hash");
  await fs.writeFile(hashPath, `${hash}\n`, "utf8");

  // Also keep .env.local in sync using $$ so dotenv-expand won't eat `$`
  const envPath = path.join(process.cwd(), ".env.local");
  let content = "";
  try {
    content = await fs.readFile(envPath, "utf8");
  } catch {
    content = "";
  }
  const escaped = hash.replace(/\$/g, "$$$$");
  if (/^ADMIN_PASSWORD_HASH=/m.test(content)) {
    content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${escaped}`);
  } else {
    content = `${content.trim()}\nADMIN_PASSWORD_HASH=${escaped}\n`;
  }
  await fs.writeFile(envPath, content, "utf8");
  process.env.ADMIN_PASSWORD_HASH = hash;
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };
    const currentPassword = body.currentPassword || "";
    const newPassword = body.newPassword || "";

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const check = await verifyAdminCredentials(session.email, currentPassword);
    if (!check.ok) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    if (!getPasswordHash()) {
      return NextResponse.json({ error: "Password hash is not configured." }, { status: 503 });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    try {
      await persistPasswordHash(hash);
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not write .env.local. Generate a new hash with scripts/hash-admin-password.mjs and set ADMIN_PASSWORD_HASH, then restart.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, message: "Password updated." });
  } catch {
    return NextResponse.json({ error: "Unable to change password." }, { status: 500 });
  }
}
