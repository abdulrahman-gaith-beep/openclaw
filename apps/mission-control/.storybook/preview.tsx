import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "../src/app/globals.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Light or dark theme for design system",
      defaultValue: "dark",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "oklch(0.97 0.002 247)" },
        { name: "dark", value: "oklch(0.12 0.02 250)" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals?.theme ?? "dark";
      return (
        <ThemeProvider key={theme} attribute="class" defaultTheme={theme} enableSystem={false} disableTransitionOnChange>
          <div className="min-h-[320px] p-6 bg-background text-foreground">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
