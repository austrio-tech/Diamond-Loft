import { createOrderEventStream } from "@/lib/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  // Only stream updates for THIS order (never leak other orders).
  return createOrderEventStream(
    req,
    (e) => e.type === "order.updated" && e.token === token
  );
}
