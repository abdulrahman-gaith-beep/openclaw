"use client";

import { motion } from "framer-motion";
import {
  staggerContainerVariants,
  slideUpVariants,
  useReducedMotion,
} from "@/design-system";

interface HeroSectionProps {
  /** Main headline (e.g. "Mission Control") */
  title: string;
  /** Optional tagline below */
  tagline?: string;
  /** Optional class for container */
  className?: string;
}

export function HeroSection({ title, tagline, className = "" }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const noMotion = { initial: {}, animate: {} };

  return (
    <motion.section
      className={`relative py-6 px-6 overflow-hidden hero-gradient-bg ${className}`}
      variants={reduceMotion ? noMotion : staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="relative z-10 max-w-4xl">
        <motion.h1
          variants={reduceMotion ? noMotion : slideUpVariants}
          className="font-bold tracking-tight font-display bg-gradient-to-r from-primary via-primary to-purple-400 bg-clip-text text-transparent hero-heading"
          style={{
            backgroundSize: "200% auto",
            fontSize: "var(--hero-heading-size)",
          }}
        >
          {title}
        </motion.h1>
        {tagline && (
          <motion.p
            variants={reduceMotion ? noMotion : slideUpVariants}
            className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl"
          >
            {tagline}
          </motion.p>
        )}
      </div>
      {/* Ambient glow accent */}
      <div
        className="absolute top-0 right-0 w-96 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />
    </motion.section>
  );
}
