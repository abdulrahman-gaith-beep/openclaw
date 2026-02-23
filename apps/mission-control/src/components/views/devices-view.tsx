"use client";

import { useState, useEffect, useCallback } from "react";
import { Smartphone, RefreshCw, Check, X, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageDescriptionBanner } from "@/components/guide/page-description-banner";
import { apiFetch } from "@/lib/api-fetch";

interface PendingDevice {
  requestId: string;
  deviceId: string;
  displayName?: string;
  role?: string;
  remoteIp?: string;
  isRepair?: boolean;
  ts?: number;
}

interface PairedDevice {
  deviceId: string;
  displayName?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  tokens?: Array<{ role: string; scopes?: string[] }>;
  createdAtMs?: number;
  approvedAtMs?: number;
}

interface DevicesViewProps {
  userCanMutate?: boolean;
}

export function DevicesView({ userCanMutate = true }: DevicesViewProps) {
  const [pending, setPending] = useState<PendingDevice[]>([]);
  const [paired, setPaired] = useState<PairedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/openclaw/devices");
      const data = (await res.json()) as { pending?: PendingDevice[]; paired?: PairedDevice[] };
      setPending(Array.isArray(data.pending) ? data.pending : []);
      setPaired(Array.isArray(data.paired) ? data.paired : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPending([]);
      setPaired([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  const handleApprove = async (requestId: string) => {
    if (!userCanMutate) {return;}
    setActionId(requestId);
    try {
      const res = await apiFetch("/api/openclaw/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", requestId }),
      });
      const data = (await res.json()) as { pending?: PendingDevice[]; paired?: PairedDevice[] };
      if (data.pending) {setPending(data.pending);}
      if (data.paired) {setPaired(data.paired);}
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!userCanMutate) {return;}
    const confirmed = window.confirm("Reject this device pairing request?");
    if (!confirmed) {return;}
    setActionId(requestId);
    try {
      const res = await apiFetch("/api/openclaw/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", requestId }),
      });
      const data = (await res.json()) as { pending?: PendingDevice[]; paired?: PairedDevice[] };
      if (data.pending) {setPending(data.pending);}
      if (data.paired) {setPaired(data.paired);}
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionId(null);
    }
  };

  const handleRevoke = async (deviceId: string, role: string) => {
    if (!userCanMutate) {return;}
    const confirmed = window.confirm(`Revoke token for ${deviceId} (${role})?`);
    if (!confirmed) {return;}
    setActionId(`${deviceId}:${role}`);
    try {
      const res = await apiFetch("/api/openclaw/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke", deviceId, role }),
      });
      const data = (await res.json()) as { pending?: PendingDevice[]; paired?: PairedDevice[] };
      if (data.pending) {setPending(data.pending);}
      if (data.paired) {setPaired(data.paired);}
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-6 pt-4 shrink-0">
        <PageDescriptionBanner pageId="devices" />
      </div>
      <div className="px-6 py-4 border-b border-border/50 flex flex-wrap items-center gap-3 shrink-0">
        <Button variant="outline" size="sm" onClick={() => void fetchDevices()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}
        {loading && pending.length === 0 && paired.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-12 h-12 mb-4 animate-spin opacity-50" />
            <p>Loading devices...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  Pending requests
                </h3>
                <div className="space-y-3">
                  {pending.map((req) => (
                    <div
                      key={req.requestId}
                      className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {req.displayName?.trim() || req.deviceId}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {req.deviceId}
                          {req.remoteIp ? ` · ${req.remoteIp}` : ""}
                        </p>
                      </div>
                      {userCanMutate && (
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => void handleApprove(req.requestId)}
                            disabled={actionId === req.requestId}
                          >
                            {actionId === req.requestId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void handleReject(req.requestId)}
                            disabled={actionId === req.requestId}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Paired devices
              </h3>
              {paired.length === 0 && pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Smartphone className="w-12 h-12 mb-4 opacity-30" />
                  <p>No paired devices.</p>
                  <p className="text-xs mt-1">Pair devices via the OpenClaw CLI or gateway.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paired.map((device) => (
                    <div
                      key={device.deviceId}
                      className="p-4 rounded-lg border border-border/50 bg-card/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium truncate">
                            {device.displayName?.trim() || device.deviceId}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {device.deviceId}
                            {device.remoteIp ? ` · ${device.remoteIp}` : ""}
                          </p>
                          {device.roles && device.roles.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Roles: {device.roles.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      {userCanMutate && device.tokens && device.tokens.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Tokens</p>
                          <div className="flex flex-wrap gap-2">
                            {device.tokens.map((token) => (
                              <Button
                                key={token.role}
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => void handleRevoke(device.deviceId, token.role)}
                                disabled={actionId === `${device.deviceId}:${token.role}`}
                              >
                                {actionId === `${device.deviceId}:${token.role}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  `Revoke ${token.role}`
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
