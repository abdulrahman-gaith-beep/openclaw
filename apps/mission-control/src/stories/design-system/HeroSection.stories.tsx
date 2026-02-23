import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@/components/ui/hero-section";

const meta: Meta<typeof HeroSection> = {
  title: "Design System/Hero Section",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    title: "Mission Control",
    tagline: "Orchestrate your AI agent squad from one command center.",
  },
};

export const ShortTagline: Story = {
  args: {
    title: "OpenClaw",
    tagline: "AI agents that ship.",
  },
};

export const NoTagline: Story = {
  args: {
    title: "Dashboard",
  },
};

export const LongTitle: Story = {
  args: {
    title: "Mission Control — AI Agent Command Center",
    tagline: "Manage tasks, agents, and workflows in one place.",
  },
};
