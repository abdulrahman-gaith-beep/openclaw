/**
 * 2026 Design System — Design tokens (JS/TS).
 * CSS variables are defined in globals.css; this file is the source of truth for typography scale, breakpoints, and any JS-consumed values.
 */

import type { TypographyScale, Breakpoints } from "./types";

export const breakpoints: Breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
};

export const typography: TypographyScale = {
  fonts: {
    display: "var(--font-space-grotesk), system-ui, sans-serif",
    heading: "var(--font-space-grotesk), Plus Jakarta Sans, sans-serif",
    body: "var(--font-space-grotesk), Inter, -apple-system, sans-serif",
    mono: "var(--font-jetbrains-mono), JetBrains Mono, ui-monospace, monospace",
  },
  sizes: {
    "2xs": "clamp(0.694rem, 0.66rem + 0.17vw, 0.8rem)",
    xs: "clamp(0.833rem, 0.777rem + 0.28vw, 1rem)",
    sm: "clamp(1rem, 0.913rem + 0.43vw, 1.25rem)",
    base: "clamp(1.2rem, 1.074rem + 0.63vw, 1.563rem)",
    lg: "clamp(1.44rem, 1.263rem + 0.89vw, 1.953rem)",
    xl: "clamp(1.728rem, 1.485rem + 1.21vw, 2.441rem)",
    "2xl": "clamp(2.074rem, 1.747rem + 1.63vw, 3.052rem)",
    "3xl": "clamp(2.488rem, 2.054rem + 2.17vw, 3.815rem)",
    "4xl": "clamp(2.986rem, 2.415rem + 2.85vw, 4.768rem)",
    "5xl": "clamp(3.583rem, 2.839rem + 3.72vw, 5.96rem)",
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },
};

/** 8px base grid multipliers for spacing */
export const spacingGrid = [
  0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128,
] as const;

export const containerMaxWidths = {
  base: 1280,
  wide: 1440,
  full: 1920,
} as const;
