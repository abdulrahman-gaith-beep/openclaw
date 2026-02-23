/**
 * Learning Hub Lessons — Shared across the dashboard
 *
 * Curated wisdom from r/cursor, r/ChatGPTCoding, AI Efficiency Handbooks.
 * Used in: task prompts, agent context, empty states, create-task UI.
 */

// --- Project Intelligence (Mission Control non-negotiables) ---

export const PROJECT_INTELLIGENCE = `## Mission Control Non-Negotiables

**Stack**: Next.js, React, TypeScript, Tailwind, Framer Motion. Use existing design tokens and glass-2.
**Patterns**: Follow existing component structure. Reference @file for similar implementations.
**Files**: Keep components under 400 lines. Split large files.
**Quality**: Production-ready = types, error handling, loading states. No chatter in output.
**Context**: Reference actual code more than abstract rules. Monkey-see-monkey-do.`;

// --- Magic Phrases (trigger quality gates) ---

export const MAGIC_PHRASES = {
  productionReady: "Make it production-ready: types, error handling, loading states.",
  followPatterns: "Follow existing patterns in the codebase exactly.",
  noChatter: "No chatter. Output only complete files.",
  thinkStepByStep: "Think step-by-step.",
  similarTo: "Make this similar to @ExistingFile.",
} as const;

// --- Daily Driver Prompt Template ---

export const DAILY_DRIVER_TEMPLATE = `Act as a senior engineer. Build [Feature X] following the patterns in @ExistingFile exactly. Production-ready: strict types, error handling, loading states. No chatter. Output only complete files.`;

// --- Execution Guidance (for task dispatch) ---

export const EXECUTION_GUIDANCE = `
**Vibe Coding Rules (apply these)**:
- Atomic prompts: Ask for one thing (e.g. "Sidebar" not "Dashboard").
- Reference actual code with @file — context is king.
- Keep changes small; commit after every green step.
- If stuck after 3 attempts: revert and re-contextualize.
- Production-ready = types, error handling, loading states.
- Follow existing patterns. Monkey-see-monkey-do beats abstract rules.
`.trim();

// --- Quick Tips for Empty States & UI ---

export const LESSON_TIPS = {
  createTask: [
    "Use atomic prompts: one clear goal per task",
    "Reference @file for similar implementations",
    "Add 'production-ready' for types and error handling",
  ],
  dispatch: [
    "Elite specialists match task type to expertise",
    "Parallel builds split work across Implementation, Tests, Docs",
    "Spec-to-build-to-verify loops improve autonomous work",
  ],
  learningHub: [
    "Build (Parallel) dispatches 3 agents: Implementation, Tests, Docs",
    "Elite lessons (90+) are battle-tested from r/cursor and GitHub",
    "Save lessons to build a personal knowledge base",
  ],
  board: [
    "Commit after every atomic green step",
    "Revert ruthlessly after 3 failed attempts",
    "Use todolist.md to track progress",
  ],
} as const;

// --- Placeholder text for Create Task ---

export const CREATE_TASK_PLACEHOLDERS = {
  title: "e.g. Add sidebar to dashboard",
  description:
    "Act as senior engineer. Build [Feature] following patterns in @ExistingFile. Production-ready: types, error handling. No chatter.",
} as const;
