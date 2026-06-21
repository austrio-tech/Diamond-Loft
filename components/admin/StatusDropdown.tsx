"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { menuPop } from "@/lib/motion";
import type { OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_DOT_CLASS: Record<OrderStatus, string> = {
  pending:   "bg-amber-500",
  confirmed: "bg-blue-500",
  shipped:   "bg-violet-500",
  delivered: "bg-green-600",
  cancelled: "bg-red-500",
};

interface Props {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  busy?: boolean;
}

export default function StatusDropdown({ value, onChange, busy }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        className={`flex items-center gap-2 px-3 py-1.5 border border-line rounded bg-surface text-sm text-ink hover:border-gold disabled:opacity-50 transition-colors ${busy ? "opacity-50" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((p) => !p)}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT_CLASS[value]}`} />
        <span>{LABELS[value]}</span>
        <ChevronDown size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full mt-1 z-10 bg-surface border border-line rounded-card shadow-card py-1 min-w-[160px]"
            role="listbox"
            variants={menuPop}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={s === value}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-ink hover:bg-soft transition-colors"
                onClick={() => { setOpen(false); if (s !== value) onChange(s); }}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT_CLASS[s]}`} />
                <span>{LABELS[s]}</span>
                {s === value && <Check size={14} className="ml-auto text-gold" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
