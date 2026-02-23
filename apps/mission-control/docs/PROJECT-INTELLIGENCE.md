# Mission Control — Project Intelligence

Non-negotiable rules for AI-assisted development. Derived from Learning Hub lessons (r/cursor, AI Efficiency Handbooks).

## Stack

- **Framework**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, design tokens, `glass-2` utility
- **Motion**: Framer Motion (respect `useReducedMotion()`)
- **State**: React hooks; no global state unless necessary

## Patterns

- Follow existing component structure
- Reference `@file` for similar implementations (monkey-see-monkey-do)
- Keep components under 400 lines; split large files
- Use `glass-2`, `rounded-xl`, design-system variants consistently

## Quality Gates

- **Production-ready** = strict types, error handling, loading states
- **No chatter** = output only complete files or actionable content
- **Atomic prompts** = one clear goal per task

## Workflow

- Plan → Execute → Review loop
- Commit after every atomic green step
- Revert ruthlessly after 3 failed attempts
- Use todolist.md to track progress

## Context

- Reference actual code more than abstract rules
- Best context is working code, not abstract rules
- Spec-to-build-to-verify loops for autonomous work
