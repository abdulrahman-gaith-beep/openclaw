# Missions Lifecycle

> Multi-task goals created, updated, and deleted from the Missions view (`#missions`).

**Related:** [Page Map](./page-map.md), [Board and Task Lifecycle](./board-and-task-lifecycle.md)

---

## API Contract

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/missions?workspace_id=<id>` | List missions with tasks |
| POST | `/api/missions` | Create mission (body: `name`, `description`, `workspace_id`) |
| PATCH | `/api/missions` | Update mission (body: `id`, `workspace_id`, optional `name`, `description`, `status`) |
| DELETE | `/api/missions?id=<id>&workspace_id=<id>` | Delete mission |

## Status Values

- `active` — Mission in progress
- `paused` — Temporarily paused
- `completed` — Finished
- `archived` — Archived

## UI Lifecycle

1. **List** — Loading spinner, empty state, or mission cards with tasks
2. **Create** — Inline form; form state preserved on API failure
3. **Update** — Edit dialog (name, description, status); errors shown inline
4. **Delete** — Confirmation dialog; errors shown inline

## Error Handling

- Fetch errors: Banner with retry button
- Create/update/delete errors: Dismissible banner; form/dialog state preserved
- No silent failures; all API errors surfaced to user

## Related Docs

- [Frontend Contracts](../api/frontend-contracts.md)
- [Error Model](../api/error-model.md)
