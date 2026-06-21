import { requireAdmin } from "@/lib/adminAuth";
import { createOrderEventStream } from "@/lib/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof Response) return err;
    return new Response("Server error", { status: 500 });
  }
  // Admins receive all order events.
  return createOrderEventStream(req, () => true);
}
