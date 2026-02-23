# Learning Hub

> Curated lessons, notifications, and multi-agent dispatch.

**Related:** [Page Map](./page-map.md), [Specialists Intelligence](./specialists-intelligence.md)

---

## Overview

The Learning Hub (`#learn`) provides:

1. **Lessons** — Curated AI tips and tutorials
2. **Progress tracking** — Lesson completion state
3. **Build + Build (Parallel)** — Multi-agent dispatch from lesson templates
4. **Notifications** — In-app notifications

---

## API Contracts

### Lessons

```
GET  /api/learning-hub/lessons
POST /api/learning-hub/lessons
Body: { title, content?, category?, tags? }
PATCH /api/learning-hub/lessons
Body: { id, title?, content?, category?, tags?, completed? }
DELETE /api/learning-hub/lessons?id=<id>
```

**Response:** `{ lessons: Lesson[] }` or single lesson

### Dispatch from Lesson

```
POST /api/tasks/dispatch
Body: { task_id, workspace_id }
```

Lessons can seed tasks; dispatch uses standard task dispatch.

---

## Source Policy

- Lessons may come from gateway, plugin, or local catalog
- Source policy docs: see Learning Hub source configuration

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No lessons | Show empty state |
| Dispatch failed | Show error; preserve lesson state |
| Keyboard navigation | Focus visible; tab order logical |

---

## Related Docs

- [Specialists Intelligence](./specialists-intelligence.md)
- [Board and Task Lifecycle](./board-and-task-lifecycle.md)
