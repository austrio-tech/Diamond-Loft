"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  /** delay in seconds */
  delay?: number;
  /** render element tag */
  as?: "div" | "section" | "article" | "li" | "span";
  once?: boolean;
  /**
   * When true (default) the entrance triggers on scroll-into-view. Set false
   * for primary content that mounts already in view (e.g. after a client-side
   * navigation/filter) so it animates on mount and never gets stuck hidden.
   */
  inView?: boolean;
}

/**
 * Fades/slides content in. Safe to wrap around server-rendered children.
 */
export default function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
  once = true,
  inView = true,
}: Props) {
  const MotionTag = motion[as];
  const trigger = inView
    ? { whileInView: "show", viewport: { once, amount: 0.2 } }
    : { animate: "show" };
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      transition={delay ? { delay } : undefined}
      {...trigger}
    >
      {children}
    </MotionTag>
  );
}
