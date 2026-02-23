import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkCsrf } from "@/lib/csrf";
import { attachRequestIdHeader, ensureRequestId, apiErrorResponse } from "@/lib/errors";
import {
  checkRateLimit,
  RateLimitPresets,
  type RateLimitConfig,
} from "@/lib/rate-limit";
import { getCurrentRiskConfig } from "@/lib/risk-level";
import {
  requireProfileWorkspaceAccess,
  requireWorkspaceRole,
  getRequestProfileId,
} from "@/lib/profile-context";
import { getProfileDashboardRole } from "@/lib/db";

export interface ApiGuardOptions {
  /** Apply in-memory rate limiting */
  rateLimit?: Partial<RateLimitConfig>;
  /** Check CSRF for state-changing routes (opt-in via env flag) */
  requireCsrf?: boolean;
  /**
   * When true, extract the profile from X-Profile-Id header and verify
   * the profile owns the workspace_id found in query params or request body.
   * Backward-compatible: requests without X-Profile-Id are allowed through.
   */
  requireProfile?: boolean;
  /**
   * When set, require the profile's workspace role to be at least this level.
   * - 'owner-or-shared': any linked profile (default when requireProfile is true).
   * - 'owner': only profile_workspaces.role = 'owner'.
   * Uses workspace_id from query or (for POST/PATCH) request body.
   */
  requireWorkspaceRole?: "owner" | "owner-or-shared";
  /**
   * When true, reject requests from profiles with dashboard_role = 'viewer'.
   * Use for mutation routes (create, update, delete).
   */
  requireCanMutate?: boolean;
  /**
   * When true, skip the profile-workspace access check (use for operations like
   * linking a profile to a workspace where the profile does not yet have access).
   */
  skipWorkspaceAccessCheck?: boolean;
}

export const ApiGuardPresets = {
  read: { rateLimit: RateLimitPresets.standard, requireCsrf: false, requireProfile: true },
  write: { rateLimit: RateLimitPresets.write, requireCsrf: true, requireProfile: true, requireCanMutate: true },
  llm: { rateLimit: RateLimitPresets.llm, requireCsrf: true, requireProfile: true, requireCanMutate: true },
  expensive: { rateLimit: RateLimitPresets.expensive, requireCsrf: true, requireProfile: true, requireCanMutate: true },
} as const;

const CSRF_ENV_FLAG =
  (
    process.env.MISSION_CONTROL_CSRF_PROTECTION ||
    (process.env.NODE_ENV === "production" ? "true" : "false")
  ).toLowerCase() ===
  "true";

type GuardedHandler = (request: NextRequest) => Promise<Response>;

/**
 * Extract workspace_id from query params (for GET/DELETE) or request body (POST/PATCH).
 * For POST/PATCH, clones the request to read body so the handler can still read it.
 */
async function extractWorkspaceId(request: NextRequest): Promise<string | null> {
  const fromQuery = request.nextUrl.searchParams.get("workspace_id");
  if (fromQuery) {
    return fromQuery;
  }
  const method = request.method?.toUpperCase();
  if (method === "POST" || method === "PATCH" || method === "PUT") {
    try {
      const cloned = request.clone();
      const body = (await cloned.json().catch(() => ({}))) as { workspace_id?: string };
      const id = body?.workspace_id;
      return typeof id === "string" && id.trim() ? id.trim() : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Shared API guard for auth, rate limiting, CSRF checks, and profile
 * workspace authorization.
 * Behavior is modulated by the current risk level.
 */
export function withApiGuard(
  handler: GuardedHandler,
  options: ApiGuardOptions = {}
): GuardedHandler {
  return async (request: NextRequest) => {
    const requestId = ensureRequestId(request.headers.get("x-request-id"));
    const riskConfig = getCurrentRiskConfig();

    // Auth — skip when risk level says auth is not required
    if (riskConfig.authRequired) {
      const authError = requireAuth(request, requestId);
      if (authError) {return authError;}
    }

    // Rate limit — apply multiplier from risk config
    if (options.rateLimit && isFinite(riskConfig.rateLimitMultiplier)) {
      const adjustedConfig: Partial<RateLimitConfig> = {
        ...options.rateLimit,
      };
      if (adjustedConfig.limit && riskConfig.rateLimitMultiplier !== 1) {
        adjustedConfig.limit = Math.max(
          1,
          Math.round(adjustedConfig.limit * riskConfig.rateLimitMultiplier)
        );
      }
      const rateLimitError = checkRateLimit(request, adjustedConfig, requestId);
      if (rateLimitError) {return rateLimitError;}
    }

    // CSRF — skip when risk level disables it
    if (options.requireCsrf && CSRF_ENV_FLAG && riskConfig.csrfEnabled) {
      const csrfError = checkCsrf(request, requestId);
      if (csrfError) {return csrfError;}
    }

    // Profile-workspace authorization
    const workspaceId = await extractWorkspaceId(request);
    if (options.requireProfile) {
      const profileError = requireProfileWorkspaceAccess(
        request,
        options.skipWorkspaceAccessCheck ? null : workspaceId,
        requestId
      );
      if (profileError) {
        return profileError;
      }
    }

    // Optional: require workspace role (owner only)
    if (options.requireWorkspaceRole === "owner") {
      const roleError = requireWorkspaceRole(
        request,
        workspaceId,
        "owner",
        requestId
      );
      if (roleError) {
        return roleError;
      }
    }

    // Optional: reject viewer role for mutations
    if (options.requireCanMutate && workspaceId) {
      const profileId = getRequestProfileId(request);
      if (profileId) {
        const dashboardRole = getProfileDashboardRole(profileId, workspaceId);
        if (dashboardRole === "viewer") {
          return apiErrorResponse({
            message: "Viewer role cannot perform this action",
            status: 403,
            code: "VIEWER_CANNOT_MUTATE",
            requestId,
          });
        }
      }
    }

    const response = await handler(request);
    return attachRequestIdHeader(response, requestId);
  };
}
