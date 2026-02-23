# Frontend Contracts

> API response shapes and client expectations for Mission Control.

**Related:** [Error Model](./error-model.md), [Page Map](../product/page-map.md)

---

## Overview

Mission Control APIs expose REST endpoints. All mutating routes require `workspace_id` where applicable. Success responses are JSON; errors follow the [Error Model](./error-model.md).

---

## Success Response Patterns

### List Resources

```json
{
  "tasks": [...],
  "total"?: number
}
```

Or:

```json
{
  "profiles": [...]
}
```

### Single Resource

```json
{
  "task": { ... }
}
```

### Action

```json
{
  "ok": true,
  "job"?: { ... },
  "result"?: unknown
}
```

---

## Workspace Scoping

All workspace-scoped endpoints require `workspace_id`:

- **Query:** `?workspace_id=<id>`
- **Body:** `{ workspace_id: "...", ... }`

Resources: tasks, missions, activity, employees, approvals (where applicable).

---

## Pagination

Where supported:

- `limit` — Max items (default varies)
- `offset` or cursor — For paginated lists

---

## Degraded Mode

Gateway-dependent endpoints may return:

```json
{
  "degraded": true,
  "warning": "Gateway unavailable. ...",
  "logs": [] | "usage": null | "cost": null
}
```

Client should show degraded state and retry affordance.

---

## Auth

- `withApiGuard` wraps routes; `ApiGuardPresets.read` / `ApiGuardPresets.write`
- Bearer token or session via `MISSION_CONTROL_API_KEY` or `OPENCLAW_AUTH_TOKEN` (when configured)

---

## Key Endpoints Summary

| Area | Endpoints |
|------|-----------|
| Tasks | `/api/tasks`, `/api/tasks/dispatch`, `/api/tasks/rework`, `/api/tasks/comments` |
| Missions | `/api/missions` |
| Agents | `/api/agents`, `/api/agents/specialists/*` |
| Chat | `/api/chat`, `/api/chat/sessions`, `/api/chat/attachments`, `/api/chat/council` |
| Orchestrator | `/api/orchestrator` |
| Gateway | `/api/openclaw/status`, `/api/openclaw/usage`, `/api/openclaw/logs`, `/api/openclaw/approvals`, `/api/openclaw/cron`, `/api/openclaw/restart`, `/api/openclaw/tools` |
| Settings | `/api/settings/api-keys`, `/api/settings/models`, `/api/models` |

