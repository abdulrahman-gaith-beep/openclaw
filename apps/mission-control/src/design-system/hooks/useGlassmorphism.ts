"use client";

export type GlassIntensity = "light" | "medium" | "strong";

const blurMap: Record<GlassIntensity, number> = {
  light: 10,
  medium: 20,
  strong: 40,
};

const opacityMap: Record<GlassIntensity, number> = {
  light: 0.1,
  medium: 0.2,
  strong: 0.3,
};

/**
 * Returns style object for glassmorphism 2.0 (backdrop blur + semi-transparent bg).
 * Use for cards, nav overlays, modals. Prefer CSS classes when possible for SSR.
 */
export function useGlassmorphism(intensity: GlassIntensity) {
  return {
    backdropFilter: `blur(${blurMap[intensity]}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blurMap[intensity]}px) saturate(180%)`,
    backgroundColor: `rgba(255, 255, 255, ${opacityMap[intensity]})`,
    border: "1px solid rgba(255, 255, 255, 0.18)",
  };
}
