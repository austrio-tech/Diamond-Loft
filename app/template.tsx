"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * Re-mounts on every route change, giving each page a gentle fade/slide-in.
 * (Wrapped here so it applies app-wide without per-page boilerplate.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
