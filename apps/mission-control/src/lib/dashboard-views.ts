/**
 * Centralized dashboard view config: valid view IDs and hash parsing.
 * Import from both sidebar and page to avoid drift.
 */

export const VALID_VIEWS = [
  "board",
  "chat",
  "orchestrate",
  "agents",
  "employees",
  "specialists",
  "learn",
  "guide",
  "all-tools",
  "workspace-settings",
  "activity",
  "templates",
  "workspaces",
  "devices",
  "missions",
  "integrations",
  "channels",
  "tools",
  "skills",
  "plugins",
  "mcp-servers",
  "usage",
  "approvals",
  "cron",
  "logs",
  "settings",
] as const;

export type ViewId = (typeof VALID_VIEWS)[number];

/** Human-readable labels for breadcrumbs and aria. */
export const VIEW_LABELS: Record<ViewId, string> = {
  board: "Dashboard",
  chat: "Chat",
  orchestrate: "Orchestrate",
  agents: "Agents",
  employees: "Employees",
  specialists: "Specialists",
  learn: "Learning Hub",
  guide: "How to Use",
  "all-tools": "All Tools",
  "workspace-settings": "Workspace settings",
  activity: "Activity",
  templates: "Templates",
  workspaces: "Workspaces",
  devices: "Devices",
  missions: "Missions",
  integrations: "Integrations",
  channels: "Channels",
  tools: "Tools Playground",
  skills: "Skills",
  plugins: "Plugins",
  "mcp-servers": "MCP Servers",
  usage: "Usage",
  approvals: "Approvals",
  cron: "Schedules",
  logs: "Logs",
  settings: "Settings",
};

export function getViewLabel(viewId: ViewId): string {
  return VIEW_LABELS[viewId] ?? viewId;
}

export function getViewFromHash(): ViewId {
  if (typeof window === "undefined") {
    return "board";
  }
  const raw = window.location.hash.replace("#", "");
  const hash = raw.split("?")[0];
  if (hash.startsWith("settings")) {
    return "settings";
  }
  return (VALID_VIEWS as readonly string[]).includes(hash) ? (hash as ViewId) : "board";
}

/** Parse agent ID from specialists hash, e.g. #specialists?agent=frontend-dev */
export function getSpecialistFromHash(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.location.hash.replace("#", "");
  if (!raw.startsWith("specialists")) {
    return null;
  }
  const params = new URLSearchParams(raw.includes("?") ? raw.split("?")[1] : "");
  return params.get("agent");
}

/** Parse task ID from board hash, e.g. #board?task=task-id */
export function getTaskFromHash(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.location.hash.replace("#", "");
  if (!raw.startsWith("board")) {
    return null;
  }
  const params = new URLSearchParams(raw.includes("?") ? raw.split("?")[1] : "");
  return params.get("task");
}

/** Parse mission ID from missions hash, e.g. #missions?mission=mission-id */
export function getMissionFromHash(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.location.hash.replace("#", "");
  if (!raw.startsWith("missions")) {
    return null;
  }
  const params = new URLSearchParams(raw.includes("?") ? raw.split("?")[1] : "");
  return params.get("mission");
}

/** Parse settings anchor from hash, e.g. #settings-api-keys */
export function getSettingsAnchorFromHash(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.location.hash.replace("#", "");
  if (!raw.startsWith("settings")) {
    return null;
  }
  const anchor = raw.includes("?") ? raw.split("?")[0] : raw;
  return anchor === "settings" ? null : anchor;
}
