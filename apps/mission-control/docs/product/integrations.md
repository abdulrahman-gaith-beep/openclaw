# Integrations

> Integration management and gateway restart.

**Related:** [Page Map](./page-map.md)

---

## Overview

The Integrations view (`#integrations`) manages external integrations and provides gateway restart capability.

---

## API Contracts

### List Integrations

```
GET /api/integrations
```

**Response:** `{ integrations: Integration[] }` or similar

### Gateway Restart

```
POST /api/openclaw/restart
```

**Response:** `{ ok: boolean }` or error

**Note:** Restart is an operational action; use with caution. Scope and operational docs should document when restart is appropriate.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | Restart may fail; show error |
| Restart in progress | Disable button; show loading |

---

## Related Docs

- [Settings and Runtime Config](./settings-and-runtime-config.md)
- [Error Model](../api/error-model.md)
