"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

type Tag = "div" | "section" | "ul";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

/** Container that staggers the entrance of its <StaggerItem> children on scroll. */
export function Stagger({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delayChildren = 0,
  once = true,
}: StaggerProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.15 }}
    >
      {children}
    </MotionTag>
  );
}

interface ItemProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "span";
}

export function StaggerItem({ children, className, as = "div" }: ItemProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={staggerItem}>
      {children}
    </MotionTag>
  );
}
