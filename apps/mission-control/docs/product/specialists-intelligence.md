# Specialists Intelligence

> AI specialist management, recommendations, and feedback loop.

**Related:** [Page Map](./page-map.md), [Learning Hub](./learning-hub.md)

---

## Overview

The Specialists view (`#specialists`) shows:

1. **Specialist catalog** — 11 AI specialists (6 engineering + 5 business/leadership)
2. **Recommendations** — Agent suggestions for a task
3. **Suggestions** — Context-aware specialist suggestions
4. **Feedback** — User feedback on specialist performance

---

## API Contracts

### List Specialists

```
GET /api/agents/specialists
```

**Response:** `{ specialists: Specialist[] }`

### Recommend

```
POST /api/agents/specialists/recommend
Body: { task_id?, title?, description?, workspace_id? }
```

**Response:** `{ recommended: Specialist[], reason?: string }`

### Suggestions

```
POST /api/agents/specialists/suggestions
Body: { context: string }
```

**Response:** `{ suggestions: Suggestion[] }`

### Feedback

```
POST /api/agents/specialists/feedback
Body: { task_id, specialist_id, rating, comment?, workspace_id }
```

**Response:** `{ ok: boolean }` or error

---

## Deep Link

`#specialists?agent=<id>` — Opens specialist panel with agent `id` selected. Used from Task Detail "View Specialist Profile" and similar flows.

---

## Panel UX

- **Keyboard:** ESC closes panel; focus trap when open
- **Scroll:** Background scroll locked when panel open
- **Accessibility:** Full keyboard and focus-safe behavior

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No specialists | Show empty state |
| Recommend with no task | Use title/description if provided |
| Feedback failed | Show error; preserve form |
| Invalid agent in deep link | Show specialists list; no selection |

---

## Related Docs

- [Learning Hub](./learning-hub.md)
- [Frontend Contracts](../api/frontend-contracts.md)
