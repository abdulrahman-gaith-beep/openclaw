import type { Meta, StoryObj } from "@storybook/react";
import { motion } from "framer-motion";
import {
  staggerContainerVariants,
  glassCardVariants,
  slideUpVariants,
  useReducedMotion,
} from "@/design-system";

function MotionDemo() {
  const reduceMotion = useReducedMotion();
  const noMotion = { initial: {}, animate: {} };
  const container = reduceMotion ? noMotion : staggerContainerVariants;
  const card = reduceMotion ? noMotion : glassCardVariants;

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="initial"
      animate="animate"
    >
      <motion.p variants={slideUpVariants} className="text-muted-foreground text-sm">
        Stagger + glass card variants. Respects <code>prefers-reduced-motion</code>.
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["One", "Two", "Three"].map((label) => (
          <motion.div
            key={label}
            variants={card}
            className="glass-2 border border-border rounded-xl p-4 text-center"
          >
            <span className="font-medium">{label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const meta: Meta<typeof MotionDemo> = {
  title: "Design System/Motion",
  component: MotionDemo,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;

export const StaggerAndCards: StoryObj<typeof MotionDemo> = {
  render: () => <MotionDemo />,
};
