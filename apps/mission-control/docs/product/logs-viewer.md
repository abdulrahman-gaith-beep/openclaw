# Logs Viewer

> Gateway log stream display and controls.

**Related:** [Page Map](./page-map.md)

---

## Overview

The Logs view (`#logs`) streams gateway logs via `/api/openclaw/logs`. Logs may be deduplicated client-side for display.

---

## API Contract

```
GET /api/openclaw/logs
```

**Response:**

```json
{
  "logs": ["line1", "line2", ...],
  "degraded"?: true,
  "warning"?: "string"
}
```

---

## Clear Behavior

When user clicks "Clear":

- **Visible logs:** Reset to empty
- **Dedupe state:** Reset alongside visible logs
- **Replay:** After clear, identical lines ingested again should appear (no stale dedupe)

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | `degraded: true`, `logs: []`, `warning` set |
| High volume | Dedupe + truncation; no UI freeze |
| Clear then new logs | New logs appear; dedupe state fresh |

---

## Related Docs

- [Error Model](../api/error-model.md)
