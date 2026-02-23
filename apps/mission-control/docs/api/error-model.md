# Error Model

> API error format and client handling.

**Related:** [Frontend Contracts](./frontend-contracts.md), [Known Limitations](../known-limitations.md)

---

## Error Response Shape

```json
{
  "ok": false,
  "error": "User-facing message",
  "errorCode": "BAD_REQUEST",
  "errorInfo": {
    "code": "BAD_REQUEST",
    "message": "User-facing message",
    "requestId": "uuid",
    "details"?: "..."  // dev only; omitted in production
  }
}
```

**Headers:**

- `X-Request-Id` — Request ID for traceability

---

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `BAD_REQUEST` | 400 | Validation or invalid input |
| `CSRF_REJECTED` | 403 | CSRF token invalid |
| `GATEWAY_UNAVAILABLE` | 503 | Gateway connection failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Client Handling

1. **Check `res.ok`** — Before parsing JSON for success
2. **Parse error payload** — `error`, `errorCode`, `errorInfo.requestId`
3. **Show user message** — Use `error`; don't expose `details` in production
4. **Retry** — For 503, 429; with backoff
5. **Preserve form state** — On 4xx; don't clear user input

---

## UserError

Server throws `UserError` for intentional 4xx:

```ts
throw new UserError("No fields to update", 400, "BAD_REQUEST");
```

---

## Gateway-Specific

- `isGatewayUnavailableError(error)` — Detects connection/WebSocket failures
- `isGatewayUnsupportedMethodError(error, method)` — Detects gateway 501 unknown method

---

## Production vs Development

- **Production:** `details` omitted in response
- **Development:** `details` may include stack or error message for debugging
