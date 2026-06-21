"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { menuPop } from "@/lib/motion";

export interface ActionItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export default function ActionMenu({ items }: { items: ActionItem[] }) {
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
        className="p-1.5 rounded hover:bg-soft text-muted hover:text-ink transition-colors"
        aria-label="Actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
      >
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-8 z-10 bg-surface border border-line rounded-card shadow-card py-1 min-w-[140px]"
            role="menu"
            variants={menuPop}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                role="menuitem"
                className={`w-full text-left px-3 py-1.5 text-sm transition-colors disabled:opacity-40 ${item.danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-ink hover:bg-soft"}`}
                disabled={item.disabled}
                onClick={() => { setOpen(false); item.onClick(); }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
