import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design System/Glass (Glassmorphism 2.0)",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;

/** Single glass-2 card */
export const GlassCard: StoryObj = {
  render: () => (
    <div className="glass-2 border border-border rounded-xl p-6 max-w-sm">
      <h3 className="font-semibold text-lg mb-2">Glass card</h3>
      <p className="text-sm text-muted-foreground">
        Uses <code className="text-xs bg-muted/50 px-1 rounded">.glass-2</code> with blur, semi-transparent
        background, and border. Part of the 2026 design system.
      </p>
    </div>
  ),
};

/** Strip of glass stat cards */
export const StatCards: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[
        { label: "Active", value: "12", sub: "agents" },
        { label: "Tasks", value: "48", sub: "in progress" },
        { label: "Done", value: "1.2k", sub: "this week" },
      ].map((item) => (
        <div
          key={item.label}
          className="glass-2 border border-border rounded-xl p-4 min-w-[140px]"
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
          <div className="text-2xl font-bold text-primary mt-1">{item.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
        </div>
      ))}
    </div>
  ),
};

/** CSS variables used by glass-2 (reference) */
export const TokensReference: StoryObj = {
  render: () => (
    <div className="glass-2 border border-border rounded-xl p-6 max-w-lg space-y-3">
      <h3 className="font-semibold text-lg">Glass 2.0 tokens</h3>
      <ul className="text-sm text-muted-foreground font-mono space-y-1">
        <li>--glass-blur</li>
        <li>--glass-bg</li>
        <li>--glass-border</li>
        <li>--glass-radius</li>
        <li>--bento-radius</li>
      </ul>
      <p className="text-xs text-muted-foreground pt-2">
        Defined in <code>src/app/globals.css</code>. Dark mode uses higher contrast borders.
      </p>
    </div>
  ),
};
