import { NextRequest } from "next/server";
import { getProfile, getProfileWorkspaceRole, listProfileWorkspaces } from "@/lib/db";
import { apiErrorResponse } from "@/lib/errors";

export type WorkspaceRole = "owner" | "shared";

/**
 * Extract the active profile ID from the request.
 * Checks X-Profile-Id header first, then falls back to cookie.
 */
export function getRequestProfileId(request: NextRequest): string | null {
    return (
        request.headers.get("x-profile-id") ||
        request.cookies.get("oc-active-profile")?.value ||
        null
    );
}

/**
 * Validate that a profile ID exists in the database.
 * Returns the profile if found, null otherwise.
 */
export function validateProfile(profileId: string) {
    return getProfile(profileId) ?? null;
}

/**
 * Check whether a profile is authorized to access a given workspace.
 * Returns true if the profile has a link in profile_workspaces.
 */
export function profileOwnsWorkspace(
    profileId: string,
    workspaceId: string
): boolean {
    const links = listProfileWorkspaces(profileId);
    return links.some((link) => link.workspace_id === workspaceId);
}

/**
 * Get the profile's role for a workspace ('owner' | 'shared'), or null if no link.
 */
export function getRequestProfileWorkspaceRole(
    profileId: string,
    workspaceId: string
): WorkspaceRole | null {
    return getProfileWorkspaceRole(profileId, workspaceId);
}

/**
 * Require that the profile has a specific role for the workspace.
 * Call after requireProfileWorkspaceAccess when workspaceId is set.
 * Returns a 403 response if the profile is not linked or role is insufficient.
 *
 * @param request - The incoming request (used to get profile ID)
 * @param workspaceId - The workspace being accessed
 * @param requiredRole - 'owner' = only owners; 'owner-or-shared' = any linked profile
 * @param requestId - Request tracing ID
 */
export function requireWorkspaceRole(
    request: NextRequest,
    workspaceId: string | undefined | null,
    requiredRole: "owner" | "owner-or-shared",
    requestId?: string
): Response | null {
    if (!workspaceId) {
        return apiErrorResponse({
            message: "workspace_id is required for this action",
            status: 400,
            code: "WORKSPACE_ID_REQUIRED",
            requestId,
        });
    }
    const profileId = getRequestProfileId(request);
    if (!profileId) {
        return null; // No profile = backward compat; let requireProfile handle presence
    }
    const profile = validateProfile(profileId);
    if (!profile) {
        return apiErrorResponse({
            message: "Profile not found",
            status: 403,
            code: "INVALID_PROFILE",
            requestId,
        });
    }
    const role = getProfileWorkspaceRole(profileId, workspaceId);
    if (!role) {
        return apiErrorResponse({
            message: "Profile does not have access to this workspace",
            status: 403,
            code: "WORKSPACE_ACCESS_DENIED",
            requestId,
        });
    }
    if (requiredRole === "owner" && role !== "owner") {
        return apiErrorResponse({
            message: "Only workspace owners can perform this action",
            status: 403,
            code: "WORKSPACE_OWNER_REQUIRED",
            requestId,
        });
    }
    return null;
}

/**
 * Full authorization check: extract profile, validate it, and verify
 * workspace access. Returns a NextResponse error if unauthorized, or null
 * if authorized.
 *
 * @param request - The incoming request
 * @param workspaceId - The workspace being accessed (optional — if omitted,
 *   only profile existence is checked)
 * @param requestId - Request tracing ID
 */
export function requireProfileWorkspaceAccess(
    request: NextRequest,
    workspaceId: string | undefined | null,
    requestId?: string
): Response | null {
    const profileId = getRequestProfileId(request);

    // If no profile header is sent, allow the request (backward compatibility
    // for programmatic / gateway callers that don't have a profile concept).
    if (!profileId) {return null;}

    const profile = validateProfile(profileId);
    if (!profile) {
        return apiErrorResponse({
            message: "Profile not found",
            status: 403,
            code: "INVALID_PROFILE",
            requestId,
        });
    }

    // If a workspace_id is provided, verify the profile owns it
    if (workspaceId) {
        if (!profileOwnsWorkspace(profileId, workspaceId)) {
            return apiErrorResponse({
                message: "Profile does not have access to this workspace",
                status: 403,
                code: "WORKSPACE_ACCESS_DENIED",
                requestId,
            });
        }
    }

    return null; // Authorized
}
