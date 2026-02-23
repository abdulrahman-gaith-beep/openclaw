"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * Viewport detection for scroll-triggered animations.
 * Use with motion components and once: true for single-run entrance.
 */
export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}
