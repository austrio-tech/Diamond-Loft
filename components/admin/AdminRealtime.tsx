"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Package } from "lucide-react";
import { menuPop } from "@/lib/motion";
import { formatPrice } from "@/lib/utils";
import type { OrderEvent } from "@/lib/events";

// ── Types ─────────────────────────────────────────────────────────────────────

type CreatedEvent = Extract<OrderEvent, { type: "order.created" }>;

interface Notification {
  id: number;
  orderId: number;
  label: string;
  href: string;
  at: string; // ISO timestamp
}

interface ToastItem {
  key: string;
  label: string;
  href: string;
}

interface RealtimeContextValue {
  unread: number;
  notifications: Notification[];
  clearUnread: () => void;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

// ── Soft beep via Web Audio API ────────────────────────────────────────────────

function playBeep(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => ctx.close();
  } catch {
    /* Web Audio not supported or blocked — ignore */
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (key: string) => void;
}) {
  const router = useRouter();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      role="alert"
      className="flex items-start gap-3 min-w-[280px] max-w-[340px] bg-surface border border-line rounded-lg shadow-xl px-4 py-3 cursor-pointer"
      onClick={() => router.push(item.href)}
    >
      <span className="flex-shrink-0 mt-0.5 text-gold">
        <Package size={16} />
      </span>
      <p className="flex-1 text-sm text-ink leading-snug">{item.label}</p>
      <button
        type="button"
        aria-label="Dismiss"
        className="flex-shrink-0 text-muted hover:text-ink transition-colors p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(item.key);
        }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ── Provider: single SSE engine + toast layer (mount once) ─────────────────────

export function AdminRealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const notifIdRef = useRef(0);

  const dismissToast = useCallback((key: string) => {
    setToasts((prev) => prev.filter((t) => t.key !== key));
  }, []);

  const clearUnread = useCallback(() => setUnread(0), []);

  // Request browser notification permission once (non-blocking).
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/admin/events");

    es.onopen = () => router.refresh();

    es.addEventListener("order.created", (e: MessageEvent) => {
      const event = JSON.parse(e.data) as CreatedEvent;
      const label = `New order #${event.id} — ${event.name} · ${formatPrice(event.total)}`;
      const href = `/admin/orders/${event.id}`;
      const toastKey = `toast-${event.id}-${Date.now()}`;

      setToasts((prev) => [...prev, { key: toastKey, label, href }]);
      setTimeout(() => dismissToast(toastKey), 6000);

      const notifId = ++notifIdRef.current;
      setNotifications((prev) =>
        [
          { id: notifId, orderId: event.id, label, href, at: event.createdAt },
          ...prev,
        ].slice(0, 20)
      );
      setUnread((n) => n + 1);

      playBeep();

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification("Diamond Loft — New Order", { body: label });
        } catch {
          /* ignore */
        }
      }

      router.refresh();
    });

    es.addEventListener("order.updated", () => {
      router.refresh();
    });

    return () => es.close();
  }, [router, dismissToast]);

  return (
    <RealtimeContext.Provider value={{ unread, notifications, clearUnread }}>
      {children}
      {/* Toast layer — fixed, rendered once */}
      <div
        aria-live="polite"
        aria-label="Order notifications"
        className="fixed top-4 right-4 z-[900] flex flex-col gap-2 pointer-events-none"
      >
        <AnimatePresence mode="sync">
          {toasts.map((t) => (
            <div key={t.key} className="pointer-events-auto">
              <Toast item={t} onDismiss={dismissToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </RealtimeContext.Provider>
  );
}

// ── Bell — reads shared context; safe to render in multiple places ─────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function NotificationBell() {
  const ctx = useContext(RealtimeContext);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!ctx) return null;
  const { unread, notifications, clearUnread } = ctx;

  function toggle() {
    if (!open) clearUnread();
    setOpen((v) => !v);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        onClick={toggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gold-light/60 hover:text-gold-light hover:bg-white/5 transition-colors"
      >
        <Bell size={18} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-gold text-ink-deep text-[9px] font-bold rounded-full flex items-center justify-center px-[3px] leading-none"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuPop}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute right-0 top-[calc(100%+6px)] w-72 bg-surface border border-line rounded-xl shadow-2xl z-[600] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-line flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] font-medium text-muted">
                Recent Orders
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-ink transition-colors p-0.5"
              >
                <X size={13} />
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="px-4 py-5 text-sm text-muted text-center">
                No notifications yet
              </p>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-line">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-soft transition-colors"
                    >
                      <span className="flex-shrink-0 mt-0.5 text-gold">
                        <Package size={14} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink leading-snug truncate">
                          {n.label}
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {relativeTime(n.at)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
