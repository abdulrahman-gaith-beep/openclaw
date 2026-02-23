"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { useReducedMotion } from "@/design-system";

/**
 * Fixed top bar showing scroll progress. Uses transform for performance.
 * Respects prefers-reduced-motion (hides when reduced).
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary/80 z-50 origin-left"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
