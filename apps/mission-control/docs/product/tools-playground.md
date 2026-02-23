# Tools Playground

> RPC testing interface for gateway tools.

**Related:** [Page Map](./page-map.md)

---

## Overview

The Tools Playground (`#tools`) provides an RPC testing interface. Users can invoke gateway tools directly for debugging and exploration.

---

## API Contract

```
GET  /api/openclaw/tools   # List available tools
POST /api/openclaw/tools   # Invoke tool (RPC passthrough)
```

**Response:** Tool-specific; passthrough to gateway.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway unavailable | Show error; disable invoke |
| Invalid tool/params | Show validation error |
| Mobile UX | Layout usable at 390px+ |

---

## Related Docs

- [All Tools](./page-map.md#all-tools)
- [Error Model](../api/error-model.md)
