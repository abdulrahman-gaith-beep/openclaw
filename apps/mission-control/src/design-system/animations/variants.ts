/**
 * 2026 Design System — Framer Motion animation variants.
 * Use with motion components; respect prefers-reduced-motion via useReducedMotion().
 */

import type { Variants, Transition } from "framer-motion";

const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
};

const springSnappy: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

const easeSmooth: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

// ---------------------------------------------------------------------------
// Fade & slide
// ---------------------------------------------------------------------------

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpVariants: Variants = {
  initial: { y: 60, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: { y: 20, opacity: 0 },
};

export const slideDownVariants: Variants = {
  initial: { y: -24, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: springTransition,
  },
};

// ---------------------------------------------------------------------------
// Scale
// ---------------------------------------------------------------------------

export const scaleInVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: springSnappy,
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
};

// ---------------------------------------------------------------------------
// Stagger container (for children)
// ---------------------------------------------------------------------------

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// ---------------------------------------------------------------------------
// Glass card entrance (glassmorphism 2.0)
// ---------------------------------------------------------------------------

export const glassCardVariants: Variants = {
  initial: {
    y: 40,
    opacity: 0,
    filter: "blur(0px)",
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: easeSmooth,
  },
};

// ---------------------------------------------------------------------------
// Gradient text reveal (use with background-clip: text)
// ---------------------------------------------------------------------------

export const gradientTextVariants: Variants = {
  initial: {
    opacity: 0,
    backgroundPosition: "200% 0",
  },
  animate: {
    opacity: 1,
    backgroundPosition: "0% 0",
    transition: {
      opacity: { duration: 0.4 },
      backgroundPosition: { duration: 2, ease: "easeInOut" },
    },
  },
};

// ---------------------------------------------------------------------------
// Transitions (export for reuse)
// ---------------------------------------------------------------------------

export const transitions = {
  spring: springTransition,
  springSnappy,
  easeSmooth,
  quick: { duration: 0.2, ease: "easeOut" as const },
  slow: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
} as const;
