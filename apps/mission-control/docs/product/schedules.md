# Schedules

> Cron job management via gateway.

**Related:** [Page Map](./page-map.md)

---

## Overview

The Schedules view (`#cron`) manages cron jobs via `/api/openclaw/cron`. Jobs are stored and executed by the gateway.

---

## API Contracts

### List Jobs

```
GET /api/openclaw/cron
```

**Response:** `{ jobs: CronJob[] }`

### List Runs

```
GET /api/openclaw/cron?runs=<jobId>
```

**Response:** `{ runs: CronRun[] }`

### Actions (POST)

```
POST /api/openclaw/cron
Body: {
  action: "add" | "run" | "update" | "remove",
  // add: prompt, schedule, agentId, sessionKey?, enabled?
  // run: id, mode?
  // update: id, prompt?, schedule?, enabled?
  // remove: id
}
```

**Response:** `{ ok: boolean, job?: CronJob, result?: unknown }` or error

---

## Action-Level Error Semantics

| Action | On Failure |
|--------|------------|
| add | Show error; form state preserved |
| run | Show error; job unchanged |
| update | Show error; form state preserved |
| remove | Show error; job list unchanged |

All cron action failures must be visible and non-destructive to UI state.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | `degraded: true`, `jobs: []` or `runs: []` |
| Invalid schedule | 400; show validation error |
| Unknown action | 400 Bad Request |

---

## Related Docs

- [Error Model](../api/error-model.md)
- [Frontend Contracts](../api/frontend-contracts.md)
