"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { OrderEvent } from "@/lib/events";

interface Props {
  token: string;
}

export default function OrderLiveUpdater({ token }: Props) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/track/${token}`);

    const handleUpdated = (e: MessageEvent<string>) => {
      // Parse to validate shape; we use the type only for strict typing.
      const _event = JSON.parse(e.data) as Extract<
        OrderEvent,
        { type: "order.updated" }
      >;
      void _event; // intentionally unused — refresh re-fetches from server

      router.refresh();

      // Show toast
      setShowToast(true);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      dismissTimer.current = setTimeout(() => setShowToast(false), 5000);
    };

    es.addEventListener("order.updated", handleUpdated);

    // On reconnect after an error, resync the page.
    let hadError = false;
    es.onerror = () => {
      hadError = true;
    };
    es.onopen = () => {
      if (hadError) {
        router.refresh();
        hadError = false;
      }
    };

    return () => {
      es.removeEventListener("order.updated", handleUpdated);
      es.close();
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [token, router]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-50 pointer-events-none"
    >
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="order-toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={[
              "bg-surface border border-line rounded-card shadow-card",
              "px-5 py-3.5 flex items-center gap-3",
              "text-sm font-medium text-ink",
              "dark:bg-surface dark:border-line dark:text-ink",
            ].join(" ")}
          >
            {/* Gold accent dot */}
            <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
            <span>Order status updated</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
