import { EventEmitter } from "events";

/**
 * In-process pub/sub for real-time order updates.
 *
 * Producers (API routes) call publishOrderEvent(); consumers (SSE routes)
 * subscribe and stream events to connected clients. This works because the app
 * runs as a single Node process on the VPS. If you ever scale to multiple
 * instances / pm2 cluster mode, replace this with a Redis pub/sub adapter.
 */

export type OrderEvent =
  | {
      type: "order.created";
      id: number;
      name: string;
      city: string;
      total: number;
      createdAt: string;
    }
  | {
      type: "order.updated";
      id: number;
      token: string;
      status: string;
      paymentStatus: string;
    };

const CHANNEL = "order";

// Survive dev hot-reload (avoid creating a new emitter on every HMR).
const globalForEvents = globalThis as unknown as {
  __orderEmitter?: EventEmitter;
};

const emitter = globalForEvents.__orderEmitter ?? new EventEmitter();
// Many concurrent SSE clients may subscribe — lift the default listener cap.
emitter.setMaxListeners(0);
if (process.env.NODE_ENV !== "production") {
  globalForEvents.__orderEmitter = emitter;
}

export function publishOrderEvent(event: OrderEvent): void {
  emitter.emit(CHANNEL, event);
}

/** Subscribe to order events. Returns an unsubscribe function. */
export function subscribeOrderEvents(
  handler: (event: OrderEvent) => void
): () => void {
  emitter.on(CHANNEL, handler);
  return () => {
    emitter.off(CHANNEL, handler);
  };
}
