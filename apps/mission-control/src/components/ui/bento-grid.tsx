"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  staggerContainerVariants,
  glassCardVariants,
  useReducedMotion,
} from "@/design-system";

export interface BentoCellProps {
  /** Content of the cell */
  children: ReactNode;
  /** Grid column span (1-4) */
  colSpan?: 1 | 2 | 3 | 4;
  /** Grid row span (1-2) */
  rowSpan?: 1 | 2;
  /** Optional className for the cell wrapper */
  className?: string;
}

function BentoCell({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = "",
}: BentoCellProps) {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? { initial: {}, animate: {} } : glassCardVariants;

  return (
    <motion.div
      variants={variants}
      whileHover={reduceMotion ? undefined : { scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={reduceMotion ? undefined : { scale: 0.98, transition: { duration: 0.1 } }}
      className={`glass-2 p-4 sm:p-5 rounded-2xl min-h-[120px] ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </motion.div>
  );
}

export interface BentoGridProps {
  /** Section heading above the grid */
  title?: string;
  /** Grid cells */
  children: ReactNode;
  /** Optional className for the section */
  className?: string;
}

/**
 * Bento-style grid: uneven cells with glass-2 and motion.
 * Use BentoCell for each cell with colSpan/rowSpan.
 */
export function BentoGrid({ title, children, className = "" }: BentoGridProps) {
  const reduceMotion = useReducedMotion();
  const containerVariants = reduceMotion
    ? { initial: {}, animate: {} }
    : staggerContainerVariants;

  return (
    <section className={`px-6 py-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
          {title}
        </h2>
      )}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[minmax(120px,auto)]"
        style={{ gridAutoFlow: "dense" }}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {children}
      </motion.div>
    </section>
  );
}

export { BentoCell };
