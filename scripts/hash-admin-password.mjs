/**
 * Usage: node scripts/hash-admin-password.mjs "YourStrongPassword"
 * Writes data/.admin-password.hash and prints the hash for .env.local (use $$ for $).
 */
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error('Provide a password (min 8 chars): node scripts/hash-admin-password.mjs "YourPassword"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const dir = path.join(process.cwd(), "data");
mkdirSync(dir, { recursive: true });
writeFileSync(path.join(dir, ".admin-password.hash"), `${hash}\n`, "utf8");

console.log(hash);
console.log("");
console.log("Saved to data/.admin-password.hash");
console.log("For .env.local use ($$ escapes $ for Next.js):");
console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "$$$$")}`);
