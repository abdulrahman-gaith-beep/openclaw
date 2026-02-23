"use client";

import { useMemo } from "react";
import { useProfiles } from "@/lib/hooks/use-profiles";

export type WorkspaceRole = "owner" | "shared";

/**
 * Returns the active profile's role for the given workspace.
 * - 'owner': can manage workspace settings, profile links, API keys, logs, schedules, etc.
 * - 'shared': can view and contribute (tasks, chat, agents) but not change workspace config.
 * - null: no link or no active profile.
 */
export function useWorkspaceRole(workspaceId: string | undefined | null): WorkspaceRole | null {
  const { activeProfile } = useProfiles();
  return useMemo(() => {
    if (!workspaceId || !activeProfile?.workspaces?.length) {
      return null;
    }
    const link = activeProfile.workspaces.find((pw) => pw.workspace_id === workspaceId);
    if (!link?.role) {
      return null;
    }
    return link.role === "owner" || link.role === "shared" ? (link.role as WorkspaceRole) : null;
  }, [workspaceId, activeProfile?.id, activeProfile?.workspaces]);
}

/**
 * True if the active profile is an owner of the given workspace.
 */
export function useIsWorkspaceOwner(workspaceId: string | undefined | null): boolean {
  const role = useWorkspaceRole(workspaceId);
  return role === "owner";
}
