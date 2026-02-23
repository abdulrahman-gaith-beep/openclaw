import type { DashboardRole } from "@/lib/db";
import type { ViewId } from "@/components/layout/sidebar";

/** Views that require admin or higher (settings, approvals, cron, logs, devices) */
const ADMIN_ONLY_VIEWS: ViewId[] = new Set(["settings", "approvals", "cron", "logs", "devices"]);

/** Views that only owner or admin can access (workspace config) */
const OWNER_OR_ADMIN_VIEWS: ViewId[] = ["workspace-settings"];

/** Views that viewer can access (read-only). All others require member+. */
const VIEWER_VIEWS: ViewId[] = [
  "board",
  "chat",
  "agents",
  "specialists",
  "learn",
  "guide",
  "all-tools",
  "activity",
  "templates",
  "workspaces",
  "missions",
  "integrations",
  "channels",
  "skills",
  "plugins",
  "mcp-servers",
  "usage",
];

/**
 * Check if a dashboard role can access a view.
 * - viewer: read-only views only
 * - member: all views except admin-only
 * - admin: all views
 * - owner: all views
 */
export function canAccessView(role: DashboardRole | null, viewId: ViewId): boolean {
  if (!role) {return true;} // Backward compat: no role = full access
  if (role === "owner" || role === "admin") {return true;}
  if (OWNER_OR_ADMIN_VIEWS.includes(viewId)) {return false;}
  if (role === "viewer") {
    return VIEWER_VIEWS.includes(viewId);
  }
  // member
  return !ADMIN_ONLY_VIEWS.has(viewId);
}

/** Check if role can perform mutations (create task, dispatch, edit, delete) */
export function canMutate(role: DashboardRole | null): boolean {
  if (!role) {return true;}
  return role !== "viewer";
}
