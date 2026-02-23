import { NextRequest, NextResponse } from "next/server";
import {
  getProfile,
  getWorkspace,
  listProfileWorkspaces,
  linkProfileWorkspace,
  unlinkProfileWorkspace,
  getProfileWorkspaceRole,
  getDb,
} from "@/lib/db";
import { withApiGuard, ApiGuardPresets } from "@/lib/api-guard";
import { handleApiError, UserError } from "@/lib/errors";
import {
  profileWorkspaceLinkSchema,
  profileWorkspaceUnlinkSchema,
  parseOrThrow,
} from "@/lib/schemas";

export const GET = withApiGuard(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profile_id");

    if (!profileId) {
      throw new UserError("profile_id query parameter is required", 400);
    }

    const profile = getProfile(profileId);
    if (!profile) {throw new UserError("Profile not found", 404);}

    const workspaces = listProfileWorkspaces(profileId);
    return NextResponse.json({ workspaces });
  } catch (error) {
    return handleApiError(error, "Failed to list profile workspaces");
  }
}, ApiGuardPresets.read);

export const POST = withApiGuard(async (request: NextRequest) => {
  try {
    const payload = parseOrThrow(
      profileWorkspaceLinkSchema,
      await request.json()
    );

    const profile = getProfile(payload.profile_id);
    if (!profile) {throw new UserError("Profile not found", 404);}

    const workspace = getWorkspace(payload.workspace_id);
    if (!workspace) {throw new UserError("Workspace not found", 404);}

    const linkCount = (getDb()
      .prepare("SELECT COUNT(*) as c FROM profile_workspaces WHERE workspace_id = ?")
      .get(payload.workspace_id) as { c: number })?.c ?? 0;
    const profileRole = getProfileWorkspaceRole(payload.profile_id, payload.workspace_id);
    const workspaceHasNoLinks = linkCount === 0;
    const profileIsOwner = profileRole === "owner";

    if (!workspaceHasNoLinks && !profileIsOwner) {
      throw new UserError(
        "Only workspace owners can add new members. For a new workspace, link it first.",
        403,
        "WORKSPACE_OWNER_REQUIRED"
      );
    }

    const role = workspaceHasNoLinks ? "owner" : (payload.role ?? "shared");
    linkProfileWorkspace(payload.profile_id, payload.workspace_id, role);

    const workspaces = listProfileWorkspaces(payload.profile_id);
    return NextResponse.json({ workspaces }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to link workspace to profile");
  }
}, { ...ApiGuardPresets.write, skipWorkspaceAccessCheck: true });

export const DELETE = withApiGuard(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const { profile_id, workspace_id } = parseOrThrow(
      profileWorkspaceUnlinkSchema,
      {
        profile_id: searchParams.get("profile_id"),
        workspace_id: searchParams.get("workspace_id"),
      }
    );

    unlinkProfileWorkspace(profile_id, workspace_id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error, "Failed to unlink workspace from profile");
  }
}, { ...ApiGuardPresets.write, requireWorkspaceRole: "owner" });
