# Usage Telemetry

> Token usage and cost tracking via gateway.

**Related:** [Page Map](./page-map.md)

---

## Overview

The Usage view (`#usage`) displays token usage and cost data from the OpenClaw gateway. Data is fetched via `/api/openclaw/usage`.

---

## API Contract

```
GET /api/openclaw/usage?period=<period>
```

**Query params:**

| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `period` | `today`, `7d`, `30d` | `today` | Time range for cost data |

**Response:**

```json
{
  "usage": { ... } | null,
  "cost": { "daily": [...], ... } | null,
  "period": "today" | "7d" | "30d",
  "normalizedPeriod": "today" | "week" | "month",
  "supportsHistoricalBreakdown": boolean,
  "fetchedAt": "ISO8601",
  "usagePeriodSupported": false,
  "costPeriodSupported": true,
  "degraded"?: true,
  "warning"?: "string"
}
```

---

## Period Semantics

- **usage:** Gateway `getUsage()` has no period params; always returns current provider usage. `usagePeriodSupported: false`.
- **cost:** Gateway `getUsageCost({ days })` supports period filtering. `costPeriodSupported: true`.
- UI period labels must match backend behavior; avoid implying period filtering for usage when unsupported.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | `degraded: true`, `usage: null`, `cost: null`, `warning` set |
| Invalid period | Default to `today` |
| No cost data | Show empty/placeholder |

---

## Related Docs

- [Known Limitations](../known-limitations.md)
- [Error Model](../api/error-model.md)
