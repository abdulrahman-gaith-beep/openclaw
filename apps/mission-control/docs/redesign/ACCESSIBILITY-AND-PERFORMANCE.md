# Accessibility & Performance — Checklist for Audit

This doc supports a future **WCAG 2.2 AAA** pass and **Core Web Vitals** budget. It does not replace a full audit.

## Already in place

- **Reduced motion** — `useReducedMotion()` and `prefers-reduced-motion` in CSS; view transitions, hero gradient, skeleton shimmer, and motion variants are disabled or no-op when the user prefers reduced motion.
- **Focus** — `:focus-visible` rings (globals.css), `.glass-2:focus-visible` ring, skip-to-content link (`.skip-link`), keyboard support on interactive cards (Enter/Space, `aria-label`).
- **Semantics** — `<main id="main-content" role="main">`, hero `<section>` + `<h1>`, Bento `<section>` + `<h2>`, buttons and links with clear labels.
- **Toast** — `role="status"`, `aria-live="polite"`, dismiss button with `aria-label`.

## WCAG 2.2 AAA — Future audit checklist

- [ ] **Color contrast** — Verify text/background and UI components meet 7:1 (AAA). Use DevTools or axe.
- [ ] **Focus order** — Tab through the app; confirm order matches visual flow and no trap.
- [ ] **Screen reader** — Landmarks, headings, and live regions announced correctly; modals trap focus and return focus on close.
- [ ] **Motion** — Confirm no essential info only in motion; reduced-motion path is tested.
- [ ] **Target size** — Touch targets ≥ 44×44px where possible (sidebar, header, CTAs).

## Core Web Vitals — Suggested budget

- **LCP** &lt; 2.5s (hero + above-the-fold content).
- **FCP** &lt; 1.8s.
- **CLS** &lt; 0.1 (skeletons and layout prevent shift; avoid inserting content above existing).
- **INP** — Keep main thread work low; lazy-loaded views and Framer Motion (transform/opacity) help.

## CI / automation ideas

- Lighthouse in CI (e.g. on PR) with thresholds for LCP, FCP, CLS.
- Bundle size budget (e.g. initial JS &lt; 150KB gzipped) as in Phase 1 analysis.
- axe-core or eslint-plugin-jsx-a11y in the lint pipeline.
