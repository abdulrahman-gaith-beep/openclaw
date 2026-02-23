/**
 * 2026 Design System — TypeScript types for tokens and components.
 * Keeps design system type-safe and documentable.
 */

import type { ReactNode } from "react";
import type { Target, Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------

export type ColorToken = `#${string}` | `rgb(${string})` | `rgba(${string})` | `oklch(${string})` | `hsl(${string})`;

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  light: string;
  DEFAULT: string;
  dark: string;
}

export interface GlassTokens {
  light: string;
  medium: string;
  strong: string;
}

export interface GradientTokens {
  hero: string;
  subtle: string;
  vibrant: string;
  primary: string;
  surface: string;
  card: string;
  glow: string;
}

export interface ColorSystem {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  success: SemanticColors;
  warning: SemanticColors;
  error: SemanticColors;
  info: SemanticColors;
  glass: GlassTokens;
  gradients: GradientTokens;
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export interface FontStack {
  display: string;
  heading: string;
  body: string;
  mono: string;
}

export interface TypographySizes {
  "2xs": string;
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
}

export interface TypographyWeights {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  black: number;
}

export interface LineHeights {
  tight: number;
  snug: number;
  normal: number;
  relaxed: number;
}

export interface TypographyScale {
  fonts: FontStack;
  sizes: TypographySizes;
  weights: TypographyWeights;
  lineHeights: LineHeights;
}

// ---------------------------------------------------------------------------
// Spacing & layout
// ---------------------------------------------------------------------------

export type SpacingToken = `${number}px` | `${number}rem` | `${number}%`;
export type BorderRadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
}

// ---------------------------------------------------------------------------
// Animation (Framer Motion)
// ---------------------------------------------------------------------------

export interface AnimationVariants {
  initial: Target;
  animate: Target;
  exit?: Target;
  hover?: Target;
  tap?: Target;
}

export interface AnimationTiming {
  duration: number;
  ease: "linear" | "easeIn" | "easeOut" | "easeInOut" | number[];
  delay?: number;
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
}

// ---------------------------------------------------------------------------
// Component prop types
// ---------------------------------------------------------------------------

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  animate?: boolean;
  delay?: number;
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "glass" | "destructive" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends BaseComponentProps {
  variant: ButtonVariant;
  size: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}
