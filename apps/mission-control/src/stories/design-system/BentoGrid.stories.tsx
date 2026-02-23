import type { Meta, StoryObj } from "@storybook/react";
import { BentoGrid, BentoCell } from "@/components/ui/bento-grid";
import { Zap, MessageSquare, Users, BookOpen, Settings } from "lucide-react";

const meta: Meta<typeof BentoGrid> = {
  title: "Design System/Bento Grid",
  component: BentoGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof BentoGrid>;

export const QuickAccess: Story = {
  args: {
    title: "Quick access",
  },
  render: (args) => (
    <BentoGrid {...args}>
      <BentoCell colSpan={1}>
        <div className="flex flex-col gap-1">
          <Zap className="w-6 h-6 text-primary" />
          <span className="font-medium text-sm">New task</span>
          <span className="text-xs text-muted-foreground">Create from template</span>
        </div>
      </BentoCell>
      <BentoCell colSpan={1}>
        <div className="flex flex-col gap-1">
          <MessageSquare className="w-6 h-6 text-primary" />
          <span className="font-medium text-sm">Chat</span>
          <span className="text-xs text-muted-foreground">Agent conversations</span>
        </div>
      </BentoCell>
      <BentoCell colSpan={1}>
        <div className="flex flex-col gap-1">
          <Users className="w-6 h-6 text-primary" />
          <span className="font-medium text-sm">Agents</span>
          <span className="text-xs text-muted-foreground">Manage squad</span>
        </div>
      </BentoCell>
      <BentoCell colSpan={1}>
        <div className="flex flex-col gap-1">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="font-medium text-sm">Learning Hub</span>
          <span className="text-xs text-muted-foreground">Lessons & builds</span>
        </div>
      </BentoCell>
      <BentoCell colSpan={2} rowSpan={2}>
        <div className="flex flex-col gap-2 h-full">
          <Settings className="w-8 h-8 text-muted-foreground" />
          <span className="font-medium">Settings</span>
          <span className="text-sm text-muted-foreground">Workspace, profiles, and preferences.</span>
        </div>
      </BentoCell>
    </BentoGrid>
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <BentoGrid>
      <BentoCell colSpan={1}>Cell 1</BentoCell>
      <BentoCell colSpan={2}>Cell 2 (wide)</BentoCell>
      <BentoCell colSpan={1} rowSpan={2}>Cell 3 (tall)</BentoCell>
      <BentoCell colSpan={2}>Cell 4</BentoCell>
      <BentoCell colSpan={1}>Cell 5</BentoCell>
    </BentoGrid>
  ),
};
