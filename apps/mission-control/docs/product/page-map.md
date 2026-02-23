# Page Map

> Canonical map of Mission Control views, routes, and API dependencies.

**Last updated:** 2026-02-23

---

## Overview

Mission Control uses hash-based routing (`#view-id`). All views are rendered within a single page; navigation updates `window.location.hash`. Workspace context is passed via `?workspace=<id>` query param.

---

## View → Route → API Matrix

| Hash | View | Primary APIs | Secondary APIs |
|------|------|--------------|-----------------|
| `#board` | Kanban Task Board | `/api/tasks`, `/api/activity`, `/api/agents`, `/api/openclaw/status` | `/api/missions`, `/api/tasks/dispatch`, `/api/tasks/rework`, `/api/tasks/comments` |
| `#chat` | Chat Panel | `/api/chat`, `/api/chat/sessions`, `/api/chat/attachments`, `/api/chat/council`, `/api/models` | — |
| `#orchestrate` | Orchestrator | `/api/orchestrator`, `/api/agents` | — |
| `#agents` | Agents View | `/api/agents` | — |
| `#employees` | Employees View | `/api/employees`, `/api/employees/hierarchy`, `/api/employees/access` | `/api/accounts`, `/api/profiles` |
| `#specialists` | AI Specialists | `/api/agents/specialists`, `/api/agents/specialists/recommend`, `/api/agents/specialists/suggestions`, `/api/agents/specialists/feedback` | — |
| `#learn` | Learning Hub | `/api/learning-hub/lessons`, `/api/tasks`, `/api/tasks/dispatch` | Specialist endpoints |
| `#guide` | How to Use | — | — |
| `#all-tools` | All Tools | `/api/plugins`, `/api/openclaw/skills`, `/api/openclaw/tools`, `/api/agents/specialists` | — |
| `#usage` | Cost Dashboard | `/api/openclaw/usage` | — |
| `#logs` | Logs Viewer | `/api/openclaw/logs` | — |
| `#approvals` | Approval Center | `/api/openclaw/approvals` | — |
| `#missions` | Missions | `/api/missions` | — |
| `#integrations` | Integrations | `/api/integrations`, `/api/openclaw/restart` | — |
| `#channels` | Channels Guide | — | — |
| `#tools` | Tools Playground | `/api/openclaw/tools` | — |
| `#skills` | Skills Dashboard | `/api/openclaw/skills`, `/api/plugins` | — |
| `#plugins` | Plugins Registry | `/api/plugins` | — |
| `#mcp-servers` | MCP Servers | `/api/plugins` | — |
| `#cron` | Schedules | `/api/openclaw/cron` | — |
| `#settings` | Settings Panel | `/api/settings/api-keys`, `/api/settings/models`, `/api/models`, `/api/openclaw/config` | — |

---

## Deep Links

| Hash | Purpose |
|------|---------|
| `#board?task=<id>` | Open task detail modal for task `id` |
| `#specialists?agent=<id>` | Open specialists panel with agent `id` selected |
| `#settings` | Settings root |
| `#settings-api-keys` | Scroll to API Keys section |
| `#settings-models` | Scroll to Local Models section |

---

## Nav Groups

| Group | Views |
|-------|-------|
| Command | board, chat, orchestrate |
| Team | agents, employees, specialists |
| Learn | learn, guide, channels |
| Tools | all-tools, plugins |

**Advanced views** (reachable via All Tools or direct hash): usage, logs, approvals, missions, integrations, channels, tools, skills, plugins, mcp-servers, cron, settings.

---

## Related Docs

- [Board and Task Lifecycle](./board-and-task-lifecycle.md)
- [Chat Operations](./chat-operations.md)
- [Orchestrator Batch Flow](./orchestrator-batch-flow.md)
- [Specialists Intelligence](./specialists-intelligence.md)
- [Learning Hub](./learning-hub.md)
- [Usage Telemetry](./usage-telemetry.md)
- [Logs Viewer](./logs-viewer.md)
- [Approvals Governance](./approvals-governance.md)
- [Missions](./missions.md)
- [Integrations](./integrations.md)
- [Tools Playground](./tools-playground.md)
- [Schedules](./schedules.md)
- [Settings and Runtime Config](./settings-and-runtime-config.md)
