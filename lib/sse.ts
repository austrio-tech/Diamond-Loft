import { subscribeOrderEvents, type OrderEvent } from "@/lib/events";

/**
 * Builds an SSE (text/event-stream) Response that pushes order events matching
 * `filter` to the client. Handles a keep-alive heartbeat and cleanup on
 * disconnect. Use from a Node-runtime route handler.
 */
export function createOrderEventStream(
  req: Request,
  filter: (event: OrderEvent) => boolean
): Response {
  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          /* controller already closed */
        }
      };

      // Open the stream.
      send(": connected\n\n");

      unsubscribe = subscribeOrderEvents((event) => {
        if (!filter(event)) return;
        send(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
      });

      // Heartbeat keeps proxies from closing an idle connection.
      heartbeat = setInterval(() => send(": ping\n\n"), 25000);

      // Clean up when the client disconnects.
      req.signal.addEventListener("abort", () => {
        if (heartbeat) clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Tell Nginx not to buffer the stream.
      "X-Accel-Buffering": "no",
    },
  });
}
