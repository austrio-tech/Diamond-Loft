import type { Variants, Transition } from "framer-motion";

// Signature easing curves (shared so everything eases identically).
export const EASE = [0.22, 1, 0.36, 1] as const; // ease-out, refined
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.8,
} as const;

export const transition = {
  base: { duration: DURATION.base, ease: EASE } as Transition,
  fast: { duration: DURATION.fast, ease: EASE } as Transition,
  slow: { duration: DURATION.slow, ease: EASE } as Transition,
};

// ── Entrance variants ─────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transition.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: transition.base },
};

// ── Stagger container/item ────────────────────────────────────
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: transition.base },
};

// ── Overlays / drawers / modals ──────────────────────────────
export const overlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.fast },
  exit: { opacity: 0, transition: transition.fast },
};

export const modalPop: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: transition.base },
  exit: { opacity: 0, scale: 0.97, y: 6, transition: transition.fast },
};

export const drawerRight: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: transition.base },
  exit: { x: "100%", transition: transition.base },
};

export const drawerLeft: Variants = {
  hidden: { x: "-100%" },
  show: { x: 0, transition: transition.base },
  exit: { x: "-100%", transition: transition.base },
};

export const menuPop: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: transition.fast },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: transition.fast },
};

// Common hover/tap for interactive elements.
export const hoverLift = { y: -4, transition: transition.fast };
export const tapPress = { scale: 0.97 };
