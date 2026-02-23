# Approvals Governance

> Command approval queue and resolution workflow.

**Related:** [Page Map](./page-map.md)

---

## Overview

The Approvals view (`#approvals`) shows pending and resolved command approvals. Approvals are emitted by the gateway when agents request user confirmation for sensitive operations.

---

## API Contracts

### List Approvals

```
GET /api/openclaw/approvals
  ?status=pending|resolved
  ?limit=<n>
```

**Response:** `{ pending: ApprovalRecord[], resolved?: ApprovalRecord[] }`

### Resolve Approval

```
POST /api/openclaw/approvals
Body: { action: "approve" | "reject" | "allow-once" | "deny", id: string }
```

**Response:** `{ ok: boolean }` or error

### Allowlist Pattern

```
POST /api/openclaw/approvals
Body: { action: "allow-pattern", pattern: string, agentId?: string }
```

---

## States

- **pending** — Awaiting user decision
- **resolved** — User approved, rejected, allowed-once, or denied

---

## Global Visibility

Approvals may be workspace-scoped or global depending on gateway config. Integration with workspace filter should align with gateway behavior.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | Show degraded state; no pending list |
| Invalid action | 400 Bad Request |
| Approval already resolved | Idempotent or 409 |

---

## Related Docs

- [Error Model](../api/error-model.md)
