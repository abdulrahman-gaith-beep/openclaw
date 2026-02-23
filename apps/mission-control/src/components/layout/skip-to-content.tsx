"use client";

/**
 * Skip-to-content link for keyboard accessibility (WCAG 2.4.1).
 * Visually hidden until focused, then appears at top of page.
 */
export function SkipToContent() {
    return (
        <a href="#main-content" className="skip-link">
            Skip to main content
        </a>
    );
}
