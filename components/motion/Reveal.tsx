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
}

/**
 * Fades/slides content in when it scrolls into view. Safe to wrap around
 * server-rendered children (this is the client boundary).
 */
export default function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
  once = true,
}: Props) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
