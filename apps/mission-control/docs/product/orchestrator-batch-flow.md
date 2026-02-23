# Orchestrator Batch Flow

> Parallel task dispatch via Orchestrator view.

**Related:** [Page Map](./page-map.md), [Board and Task Lifecycle](./board-and-task-lifecycle.md)

---

## Overview

The Orchestrator (`#orchestrate`) dispatches multiple tasks in parallel to a single agent. All operations are workspace-scoped.

---

## API Contract

```
POST /api/orchestrator
Body: {
  workspace_id: string
  agent_id: string
  tasks: Array<{ title: string, description?: string, priority?: string }>
}
```

**Response:** `{ ok: boolean, dispatched?: string[], error?: string }`

---

## Flow

1. User selects agent from dropdown
2. User adds tasks (title, description, priority) to queue
3. User clicks "Launch" or equivalent
4. Frontend sends batch to `/api/orchestrator`
5. Backend creates tasks and dispatches each to agent
6. On success: tasks appear on board; queue cleared
7. On failure: queue preserved; error shown

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | Show error; do not clear queue |
| Partial success | Report which tasks dispatched; keep failed in queue |
| Empty tasks array | 400 or validation error |
| Missing workspace_id | 400 Bad Request |
| Invalid agent_id | 400 or 404 |

---

## Workspace Isolation

- All tasks created in `workspace_id` from request
- Activity logged with workspace scope
- No cross-workspace leakage

---

## Related Docs

- [Board and Task Lifecycle](./board-and-task-lifecycle.md)
- [Frontend Contracts](../api/frontend-contracts.md)
- [Error Model](../api/error-model.md)
