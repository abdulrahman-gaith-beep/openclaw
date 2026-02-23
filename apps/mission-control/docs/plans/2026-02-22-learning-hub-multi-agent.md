# Learning Hub: Multi-Agent Parallel Builds

**Date:** 2026-02-22  
**Status:** Implemented

## Summary

Learning Hub lessons can now be built with **multiple agents in parallel**. Instead of a single task assigned to one specialist, users can choose "Build (Parallel)" to split a lesson into Implementation, Tests, and Docs sub-tasks, each dispatched to a different recommended specialist via the orchestrator.

## Lessons Learned (from Learning Hub curation)

Key lessons that informed this implementation:

1. **Spec-to-build-to-verify loops** (agent-rebuilt-itself) — Crucial for autonomous coding; parallel sub-tasks mirror this.
2. **Switch models strategy** (switch-models-strategy) — Fast models for boilerplate, smart for logic; sub-tasks allow different specialists with different strengths.
3. **Context rot fix** (context-rot-fix) — Plan → Execute → Review; Implementation/Tests/Docs is a natural split.
4. **GOAT workflow** (goat-workflow) — One massive context; each sub-task gets full lesson context.

## Implementation

### Changes

| File | Change |
|------|--------|
| `src/components/views/learning-hub.tsx` | Added `handleBuildLessonMultiAgent`, `BuildTaskMap` now supports `string \| string[]`, `toTaskIds` helper, `PARALLEL_SUBTASK_TEMPLATES`, "Parallel" button on cards and modal |
| `docs/redesign/IMPLEMENTATION-SUMMARY.md` | Documented multi-agent builds |

### Sub-task templates

| Suffix | Description |
|--------|-------------|
| Implementation | Core improvement from the lesson; new feature or existing code improvement |
| Tests | Add/update tests; ensure improvement is verifiable |
| Docs | Update README, comments, or inline docs |

### Flow

1. User clicks "Parallel" on a lesson card (or "Build (Parallel)" in the detail modal).
2. `handleBuildLessonMultiAgent` calls `/api/agents/specialists/recommend` with `limit: 3`.
3. If no specialists, error: "No specialists available. Add agents in the Agents view first."
4. Builds 3 task defs (or fewer if fewer specialists) using `PARALLEL_SUBTASK_TEMPLATES`.
5. Calls `POST /api/orchestrator` with `tasks`, `missionName`, `workspace_id`.
6. Stores returned task IDs in `buildTaskByLesson[lessonId] = [id1, id2, id3]`.
7. Feature Builds list shows one row per task (flattened).

### Backward compatibility

- `BuildTaskMap` values can be `string` (legacy) or `string[]`.
- `buildInitialLearningHubState` migrates: `toTaskIds(val)` normalizes to array.
- `FeatureBuildsList` flattens entries so each (lessonId, taskId) pair gets a row.

## Full Dashboard Integration (2026-02-22)

Lessons are now integrated across the entire dashboard:

| Location | Integration |
|----------|-------------|
| `src/lib/learning-hub-lessons.ts` | Shared module: PROJECT_INTELLIGENCE, EXECUTION_GUIDANCE, LESSON_TIPS, CREATE_TASK_PLACEHOLDERS |
| `src/app/api/tasks/dispatch/route.ts` | EXECUTION_GUIDANCE in buildExecutionPreflightBlock |
| `src/app/api/orchestrator/route.ts` | EXECUTION_GUIDANCE in task prompts |
| `src/lib/specialist-intelligence.ts` | PROJECT_INTELLIGENCE in buildSpecialistExecutionContext |
| `src/components/empty-states.tsx` | LESSON_TIPS in EmptyInbox, EmptyAgents, EmptyOrchestrator, EmptyLearning |
| `src/components/modals/create-task.tsx` | CREATE_TASK_PLACEHOLDERS for title/description |
| `src/components/views/quick-actions.tsx` | Lesson-based descriptions for Create Task, Learning Hub |
| `docs/PROJECT-INTELLIGENCE.md` | Mission Control non-negotiables document |

## Next steps

- [ ] Add tags (e.g. `learning-hub`, `lesson`, `lesson-id`) to orchestrator-created tasks when called from Learning Hub (requires orchestrator schema extension).
- [ ] Allow user to pick which sub-tasks to run (e.g. Implementation only, or Implementation + Tests).
- [x] Surface orchestrator batch status in Learning Hub (e.g. "2/3 dispatched") — implemented 2026-02-23.
