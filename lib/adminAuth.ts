import { auth } from "./auth";

/**
 * Guard for API route handlers. Throws a 401 Response if no admin session.
 * Usage:
 *   try { await requireAdmin(); ... }
 *   catch (err) { if (err instanceof Response) return err; ... }
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
