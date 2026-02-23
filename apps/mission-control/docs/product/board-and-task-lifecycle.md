# Board and Task Lifecycle

> Kanban board workflow, task states, and API contracts.

**Related:** [Page Map](./page-map.md), [Chat Operations](./chat-operations.md), [Missions](./missions.md)

---

## Overview

The Task Board (`#board`) shows tasks across five workflow stages. Tasks are workspace-scoped; all operations require `workspace_id`.

---

## Task Status Flow

```
inbox → assigned → in_progress → review → done
```

| Status | Meaning |
|--------|---------|
| `inbox` | New task, not yet assigned |
| `assigned` | Assigned to agent/employee |
| `in_progress` | Agent actively working |
| `review` | Awaiting human review |
| `done` | Completed |

---

## API Contracts

### List Tasks

```
GET /api/tasks?workspace_id=<id>
  ?status=<status>           # optional filter
  ?mission_id=<id>          # optional filter
  ?agent_id=<id>            # optional filter
```

**Response:** `{ tasks: Task[] }`

### Create Task

```
POST /api/tasks
Body: { title, description?, status?, priority?, mission_id?, assigned_agent_id?, employee_id?, tags?, due_date?, cost_estimate?, workspace_id }
```

**Response:** `{ task: Task }` or error

### Update Task (including status via drag)

```
PATCH /api/tasks
Body: { id, workspace_id, ...fields }
```

**Response:** `{ task: Task }` or error

### Dispatch Task

```
POST /api/tasks/dispatch
Body: { task_id, workspace_id }
```

**Response:** `{ ok: boolean, error?: string }`

### Rework Task

```
POST /api/tasks/rework
Body: { task_id, workspace_id, comment? }
```

**Response:** `{ ok: boolean, error?: string }`

### Comments

```
GET  /api/tasks/comments?task_id=<id>&workspace_id=<id>
POST /api/tasks/comments
Body: { task_id, workspace_id, content, author_type: "user" | "agent" }
```

---

## Priority Values

- `low`, `medium`, `high`, `urgent`

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Drag to same column | No API call |
| Dispatch failed (gateway unavailable) | Show error toast; task stays in current column |
| Rework failed | Preserve form state; show inline error |
| Comment failed | Preserve input; show error |
| Missing workspace_id | 400 Bad Request |
| Empty task list | Show EmptyInbox state |
| Search with no results | Show EmptySearchResults |

---

## States and UI

- **Loading:** Skeleton or spinner
- **Empty:** EmptyInbox or EmptySearchResults
- **Error:** Banner with retry
- **Success:** No silent failures; optimistic updates reverted on API failure

---

## Related Docs

- [Frontend Contracts](../api/frontend-contracts.md)
- [Error Model](../api/error-model.md)
