/**
 * Creates a crash-consistent backup of the SQLite database and uploaded files.
 *
 * - The DB is snapshotted with `VACUUM INTO`, which produces a clean, consistent
 *   copy even while the app is actively writing (no need to stop the server).
 * - The `public/uploads/` folder (payment receipts, product images) is copied.
 * - Old backups are rotated; only the most recent BACKUP_KEEP are retained.
 *
 * Usage: npm run db:backup
 * Recommended: run nightly via cron (see README "Backups").
 */
import { PrismaClient } from "@prisma/client";
import {
  mkdirSync,
  existsSync,
  cpSync,
  readdirSync,
  rmSync,
  statSync,
} from "fs";
import { join } from "path";

const ROOT = process.cwd();
const BACKUP_DIR = join(ROOT, "backups");
const UPLOADS_DIR = join(ROOT, "public", "uploads");
const BACKUP_KEEP = Number(process.env.BACKUP_KEEP ?? 14);

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = join(BACKUP_DIR, stamp);
  mkdirSync(dest, { recursive: true });

  // 1. Consistent DB snapshot via VACUUM INTO (target must not already exist).
  const prisma = new PrismaClient();
  try {
    const dbOut = join(dest, "dev.db");
    await prisma.$executeRawUnsafe(`VACUUM INTO '${dbOut.replace(/'/g, "''")}'`);
  } finally {
    await prisma.$disconnect();
  }

  // 2. Copy uploaded files (receipts / product images), if any.
  if (existsSync(UPLOADS_DIR)) {
    cpSync(UPLOADS_DIR, join(dest, "uploads"), { recursive: true });
  }

  // 3. Rotate — keep only the most recent BACKUP_KEEP backups.
  const backups = readdirSync(BACKUP_DIR)
    .filter((d) => {
      try {
        return statSync(join(BACKUP_DIR, d)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort(); // ISO timestamps sort chronologically

  while (backups.length > BACKUP_KEEP) {
    const oldest = backups.shift();
    if (oldest) rmSync(join(BACKUP_DIR, oldest), { recursive: true, force: true });
  }

  console.log(`✓ Backup created: ${dest}`);
  console.log(`  Retained backups: ${backups.length} (keeping latest ${BACKUP_KEEP})`);
}

main().catch((e) => {
  console.error("Backup failed:", e);
  process.exit(1);
});
