# Known Limitations

> Registry of current product and API limitations.

**Last updated:** 2026-02-23

---

## Usage Telemetry

| Limitation | Impact |
|------------|--------|
| `usagePeriodSupported: false` | Gateway `getUsage()` has no period params; always returns current provider usage. Period UI for usage applies only to cost data. |
| Cost period | `getUsageCost({ days })` supports period filtering; `costPeriodSupported: true`. |

See [Usage Telemetry](./product/usage-telemetry.md).

---

## Logs Viewer

| Limitation | Impact |
|------------|--------|
| Clear vs dedupe | Clear must reset both visible logs and dedupe state. After clear, identical lines should appear again. |

See [Logs Viewer](./product/logs-viewer.md).

---

## Agents

| Limitation | Impact |
|------------|--------|
| Create flow blocked by 501 | Gateway may return 501 for agent creation; UI shows explicit guidance when unsupported. |

---

## Integrations

| Limitation | Impact |
|------------|--------|
| Restart scope | Gateway restart is operational; scope and operational docs should document when restart is appropriate. |

---

## Settings

| Limitation | Impact |
|------------|--------|
| Runtime vs local ambiguity | API keys and local models stored in Mission Control DB; models catalog may mix gateway + local. UI should clarify. |

See [Settings and Runtime Config](./product/settings-and-runtime-config.md).

---

## Approvals

| Limitation | Impact |
|------------|--------|
| Global visibility integration gap | Approvals may be workspace-scoped or global; integration with workspace filter should align with gateway. |

See [Approvals Governance](./product/approvals-governance.md).

---

## Orchestrator

| Limitation | Impact |
|------------|--------|
| Workspace scope | Not fully enforced in all paths; WP-03 addresses. |
| Failed launch | Queue must not be cleared on failed launch. |

See [Orchestrator Batch Flow](./product/orchestrator-batch-flow.md).

---

## Board

| Limitation | Impact |
|------------|--------|
| Workspace leakage | Cross-workspace activity may leak; WP-02 addresses. |
| Silent fetch errors | Some fetch paths may fail silently; error handling hardening in progress. |

See [Board and Task Lifecycle](./product/board-and-task-lifecycle.md).
