"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { overlay, modalPop } from "@/lib/motion";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              className="bg-surface border border-line rounded-card shadow-card p-6 w-full max-w-sm pointer-events-auto"
              variants={modalPop}
              initial="hidden"
              animate="show"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="confirm-title" className="font-serif text-lg text-ink mb-2">{title}</h2>
              <p className="text-sm text-muted mb-6">{message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 text-sm border border-line rounded hover:bg-soft text-muted transition-colors"
                  onClick={onCancel}
                  disabled={busy}
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm rounded font-medium transition-colors disabled:opacity-50 ${danger ? "bg-red-600 text-white hover:bg-red-700" : "bg-ink-deep text-gold hover:opacity-90"}`}
                  onClick={onConfirm}
                  disabled={busy}
                >
                  {busy ? "Working…" : confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
