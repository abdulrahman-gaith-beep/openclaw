import { NextRequest, NextResponse } from "next/server";
import { getOpenClawClient } from "@/lib/openclaw-client";
import { withApiGuard, ApiGuardPresets } from "@/lib/api-guard";
import { handleApiError, UserError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/schemas";
import { z } from "zod";

const deviceApproveSchema = z.object({
  action: z.literal("approve"),
  requestId: z.string().trim().min(1),
});

const deviceRejectSchema = z.object({
  action: z.literal("reject"),
  requestId: z.string().trim().min(1),
});

const deviceRevokeSchema = z.object({
  action: z.literal("revoke"),
  deviceId: z.string().trim().min(1),
  role: z.string().trim().min(1),
});

const devicePostSchema = z.discriminatedUnion("action", [
  deviceApproveSchema,
  deviceRejectSchema,
  deviceRevokeSchema,
]);

export const GET = withApiGuard(async () => {
  try {
    const client = getOpenClawClient();
    await client.connect();
    const res = await client.call("device.pair.list", {}, 15000);
    const data = res as { pending?: unknown[]; paired?: unknown[] } | null;
    return NextResponse.json({
      pending: Array.isArray(data?.pending) ? data.pending : [],
      paired: Array.isArray(data?.paired) ? data.paired : [],
    });
  } catch (error) {
    return handleApiError(error, "Failed to fetch devices");
  }
}, { ...ApiGuardPresets.read, skipWorkspaceAccessCheck: true });

export const POST = withApiGuard(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const payload = parseOrThrow(devicePostSchema, body);

    const client = getOpenClawClient();
    await client.connect();

    if (payload.action === "approve") {
      await client.call("device.pair.approve", { requestId: payload.requestId }, 15000);
    } else if (payload.action === "reject") {
      await client.call("device.pair.reject", { requestId: payload.requestId }, 15000);
    } else if (payload.action === "revoke") {
      await client.call("device.token.revoke", { deviceId: payload.deviceId, role: payload.role }, 15000);
    } else {
      throw new UserError("Invalid action", 400);
    }

    const res = await client.call("device.pair.list", {}, 15000);
    const data = res as { pending?: unknown[]; paired?: unknown[] } | null;
    return NextResponse.json({
      ok: true,
      pending: Array.isArray(data?.pending) ? data.pending : [],
      paired: Array.isArray(data?.paired) ? data.paired : [],
    });
  } catch (error) {
    return handleApiError(error, "Failed to perform device action");
  }
}, { ...ApiGuardPresets.write, skipWorkspaceAccessCheck: true });
