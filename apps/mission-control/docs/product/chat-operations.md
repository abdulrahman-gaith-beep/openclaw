# Chat Operations

> Agent chat interface, sessions, attachments, and council chat.

**Related:** [Page Map](./page-map.md), [Board and Task Lifecycle](./board-and-task-lifecycle.md)

---

## Overview

The Chat view (`#chat`) provides:

1. **Direct agent chat** — 1:1 conversation with an AI agent
2. **Chat sessions** — List and manage conversation history
3. **Attachments** — File uploads for context
4. **Council chat** — Multi-agent council mode

---

## API Contracts

### List Models

```
GET /api/models
```

**Response:** `{ models: Model[] }` — Available AI models for chat

### Chat (Send Message)

```
POST /api/chat
Body: { message, agent_id?, session_id?, model_id? }
```

**Response:** Stream or JSON with assistant reply

### Sessions

```
GET  /api/chat/sessions
POST /api/chat/sessions
Body: { agent_id?, title? }
PATCH /api/chat/sessions
Body: { id, title? }
DELETE /api/chat/sessions?id=<id>
```

### Attachments

```
POST /api/chat/attachments
Body: FormData (file)
```

**Response:** `{ url: string }` or attachment metadata

### Council Chat

```
POST /api/chat/council
Body: { message, agent_ids?, session_id? }
```

**Response:** Stream or JSON with council reply

---

## Session Lifecycle

1. **Create:** User starts new chat → `POST /api/chat/sessions`
2. **Send:** User sends message → `POST /api/chat` with `session_id`
3. **List:** User loads sessions → `GET /api/chat/sessions`
4. **Update:** User renames session → `PATCH /api/chat/sessions`
5. **Delete:** User removes session → `DELETE /api/chat/sessions`

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Gateway offline | Show connection error; disable send |
| No models available | Show "No models" message |
| Empty session list | Show empty state |
| Attachment too large | Show upload error |
| Stream interrupted | Show partial response + error |

---

## Related Docs

- [Frontend Contracts](../api/frontend-contracts.md)
- [Error Model](../api/error-model.md)
