# WP-02: Workspace Integrity Enforcement — Implementation Summary

**Date:** 2026-02-22  
**Plan:** `enterprise-audit-and-swarm-implementation-plan-2026-02-16.md`

## Summary of Changes

### 1. `logActivity` — Require `workspace_id` (db.ts)

- **Before:** `workspace_id` was optional; defaulted to `"golden"` when missing.
- **After:** `workspace_id` is **required**. Throws if missing or empty:
  ```
  logActivity: workspace_id is required and must be non-empty. All activity must be explicitly scoped to a workspace to prevent cross-workspace leakage.
  ```

### 2. Call Sites Updated

| File | Change |
|------|--------|
| `src/app/api/tasks/dispatch/route.ts` | Added `workspace_id: task.workspace_id` to both `logActivity` calls |
| `src/app/api/orchestrator/route.ts` | Added `workspace_id` to both `logActivity` calls (from request body) |
| `src/app/api/tasks/rework/route.ts` | Added `workspace_id: task.workspace_id` |
| `src/app/api/missions/route.ts` | Already passed `workspace_id` ✓ |
| `src/app/api/missions/save-queue/route.ts` | Already passed `workspace_id` ✓ |
| `src/app/api/tasks/comments/route.ts` | Already passed `workspace_id` ✓ |
| `src/app/api/agents/specialists/feedback/route.ts` | Added `workspace_id` to schema and `logActivity`; validate task belongs to workspace when `taskId` present |
| `src/app/api/tasks/route.ts` | Added `workspaceId` to `ensureSystemFeedbackForCompletedTask`; all `logActivity` calls already had `workspace_id` ✓ |
| `src/app/api/profiles/route.ts` | Added `workspace_id` to create/update/delete schemas and all `logActivity` calls |
| `src/app/api/workspaces/route.ts` | Added `workspace_id` to delete query schema and `logActivity` |
| `src/lib/schedule-engine.ts` | Already passed `workspace_id` ✓ |
| `src/lib/agent-task-monitor.ts` | Added `workspace_id: task.workspace_id` to both `logActivity` calls |
| `src/app/api/tasks/route.secured.ts.example` | Added `workspace_id` to all `logActivity` calls (example file) |

### 3. Schema Changes

- **specialistFeedbackSchema:** Added required `workspace_id: workspaceSchema`
- **createProfileSchema:** Added required `workspace_id: workspaceSchema`
- **updateProfileSchema:** Added required `workspace_id: workspaceSchema`
- **deleteProfileQuerySchema:** Added required `workspace_id: workspaceSchema`
- **deleteWorkspaceQuerySchema:** Added required `workspace_id: workspaceSchema`

### 4. Frontend Updates

- **task-detail.tsx:** `POST /api/agents/specialists/feedback` now sends `workspace_id: task.workspace_id`
- **manage-profiles.tsx:** Accepts `workspaceId` prop; passes it to create/update/delete profile and delete workspace APIs
- **page.tsx:** Passes `workspaceId={effectiveWorkspace}` to `ManageProfilesDialog`

## Legacy Rows / Migration Checklist

- **Migration 2026-02-16-001** already backfills `activity_log` rows with `workspace_id = 'golden'` where NULL or empty.
- **No new migration needed.** Existing rows have `workspace_id` populated.
- **Verification query:**
  ```sql
  SELECT COUNT(*) FROM activity_log WHERE workspace_id IS NULL OR workspace_id = '';
  -- Should return 0 after migration 2026-02-16-001.
  ```

## Verification Approach

1. **Build:** `npm run build` — ensure no TypeScript errors.
2. **Lint:** `npm run lint` — pre-existing issues may remain; no new ones from WP-02.
3. **Cross-workspace smoke:**
   - Create tasks in workspace A and B.
   - Dispatch, rework, add comments, submit specialist feedback in each.
   - Verify `/api/activity?workspace_id=A` returns only A’s activity.
   - Verify `/api/activity?workspace_id=B` returns only B’s activity.
4. **Regression:** Run `npm run test:api-contract` and `npm run test:chat-e2e` if available.

## Acceptance Criteria Met

- [x] No new activity row can be written without explicit workspace scope.
- [x] Cross-workspace dashboard activity no longer leaks (enforced at write time).
