"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGatewayConnectionState,
  useGatewayEvents,
  type GatewayEvent,
  type GatewayConnectionState,
} from "@/lib/hooks/use-gateway-events";

function isApprovalRelatedEvent(event: GatewayEvent): boolean {
  if (event.type !== "gateway_event") {return false;}
  const lower = (event.event || "").toLowerCase();
  return lower.includes("approval");
}

const FALLBACK_INTERVAL_MS = 30_000;
const MIN_FETCH_GAP_MS = 1200;

/**
 * Returns the live pending approvals count from the gateway.
 * Refetches on approval-related gateway events and polls when disconnected.
 */
export function usePendingApprovals(): number {
  const [pendingCount, setPendingCount] = useState(0);
  const [connectionState, setConnectionState] =
    useState<GatewayConnectionState>("connecting");
  const lastFetchRef = useRef(0);

  const fetchCount = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < MIN_FETCH_GAP_MS) {return;}
    lastFetchRef.current = now;

    try {
      const res = await fetch("/api/openclaw/approvals", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as { approvals?: unknown[] };
      const approvals = Array.isArray(data.approvals) ? data.approvals : [];
      setPendingCount(approvals.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  const handleGatewayEvent = useCallback(
    (event: GatewayEvent) => {
      if (isApprovalRelatedEvent(event)) {
        void fetchCount();
      }
    },
    [fetchCount]
  );

  const handleConnectionState = useCallback((state: GatewayConnectionState) => {
    setConnectionState(state);
    if (state === "connected") {
      void fetchCount();
    }
  }, [fetchCount]);

  useGatewayEvents(handleGatewayEvent);
  useGatewayConnectionState(handleConnectionState);

  useEffect(() => {
    void fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    if (connectionState === "connected") {return;}
    const intervalId = setInterval(() => {
      void fetchCount();
    }, FALLBACK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [connectionState, fetchCount]);

  return pendingCount;
}
