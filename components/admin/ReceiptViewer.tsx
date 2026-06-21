"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { overlay, modalPop } from "@/lib/motion";

interface Props {
  url: string | null;
  /** thumbnail size class, e.g. "w-12 h-12" */
  size?: string;
}

export default function ReceiptViewer({ url, size = "w-12 h-12" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!url || !url.startsWith("/api/uploads/")) {
    return <span className="text-muted text-sm">—</span>;
  }

  return (
    <>
      <button
        type="button"
        aria-label="View receipt"
        title="View receipt"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="block"
      >
        <img
          src={url}
          alt="Receipt"
          className={`${size} object-cover rounded border border-line block hover:opacity-80 transition-opacity`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-6"
          >
            <motion.div
              key="modal"
              variants={modalPop}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[90vh]"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-surface border border-line text-ink flex items-center justify-center shadow-card"
              >
                <X size={18} />
              </button>
              <img
                src={url}
                alt="Payment receipt"
                className="max-w-full max-h-[90vh] rounded-card border border-line bg-surface"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
