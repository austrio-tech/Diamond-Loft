/**
 * Enables SQLite WAL (Write-Ahead Logging) journal mode.
 *
 * WAL improves durability and allows reads to proceed concurrently with a
 * write — better behaviour under crashes and concurrent traffic. The mode is
 * stored in the database file header, so it persists across restarts; you only
 * need to run this once per database (e.g. right after `db:push` on a new
 * deployment). Safe to run repeatedly.
 *
 * Usage: npm run db:wal
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // PRAGMA journal_mode returns the resulting mode, so use a query, not execute.
  // WAL is stored in the DB file header and persists across restarts.
  const result = await prisma.$queryRawUnsafe<Array<{ journal_mode: string }>>(
    "PRAGMA journal_mode=WAL;"
  );
  const mode = result?.[0]?.journal_mode ?? "unknown";
  console.log(`✓ SQLite journal_mode is now: ${mode}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
