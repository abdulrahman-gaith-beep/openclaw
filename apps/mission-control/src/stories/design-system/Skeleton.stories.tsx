import type { Meta, StoryObj } from "@storybook/react";
import { ViewSkeleton } from "@/components/layout/view-skeleton";

const meta: Meta<typeof ViewSkeleton> = {
  title: "Design System/Skeleton",
  component: ViewSkeleton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ViewSkeleton>;

export const Grid: Story = {
  args: { variant: "grid" },
};

export const List: Story = {
  args: { variant: "list" },
};

export const Dashboard: Story = {
  args: { variant: "dashboard" },
};

export const Form: Story = {
  args: { variant: "form" },
};
