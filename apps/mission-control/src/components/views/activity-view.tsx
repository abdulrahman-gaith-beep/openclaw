"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, RefreshCw, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageDescriptionBanner } from "@/components/guide/page-description-banner";
import { apiFetch } from "@/lib/api-fetch";

interface ActivityEntry {
  id: string;
  type: string;
  agent_id: string | null;
  task_id: string | null;
  mission_id: string | null;
  workspace_id: string;
  message: string;
  metadata: string;
  created_at: string;
}

interface ActivityViewProps {
  workspaceId: string;
  onOpenTask?: (taskId: string) => void;
  onNavigateToMission?: (missionId: string) => void;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) {return "Just now";}
    if (diffMins < 60) {return `${diffMins}m ago`;}
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {return `${diffHours}h ago`;}
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {return `${diffDays}d ago`;}
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
  } catch {
    return iso;
  }
}

export default function ActivityView({
  workspaceId,
  onOpenTask,
  onNavigateToMission,
}: ActivityViewProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");

  const fetchActivity = useCallback(async () => {
    if (!workspaceId) {return;}
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        workspace_id: workspaceId,
        limit: "100",
      });
      if (typeFilter) {params.set("type", typeFilter);}
      const res = await apiFetch(`/api/activity?${params.toString()}`);
      const data = (await res.json()) as { activity?: ActivityEntry[] };
      setEntries(data.activity ?? []);
    } catch {
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [workspaceId, typeFilter]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const types = Array.from(new Set(entries.map((e) => e.type).filter(Boolean))).toSorted();
  const typeOptions = types.length > 0 ? types : ["task_created", "task_dispatched", "task_status_changed", "mission_created", "workspace_created"];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
      <PageDescriptionBanner pageId="activity" className="mb-4" />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Activity</h1>
          <p className="text-sm text-muted-foreground">
            Audit log for this workspace
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none"
          >
            <option value="">All types</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={fetchActivity} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/50 p-8 text-center text-muted-foreground text-sm">
          No activity yet for this workspace.
        </div>
      ) : (
        <ul className="space-y-1">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 px-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors text-sm"
            >
              <span className="shrink-0 text-xs text-muted-foreground font-mono w-32">
                {formatTime(entry.created_at)}
              </span>
              <span className="shrink-0 px-2 py-0.5 rounded bg-muted text-xs font-medium w-40 truncate" title={entry.type}>
                {entry.type.replace(/_/g, " ")}
              </span>
              <span className="flex-1 min-w-0 truncate text-foreground">
                {entry.message}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {entry.task_id && (
                  <button
                    type="button"
                    onClick={() => onOpenTask?.(entry.task_id!)}
                    className="text-xs text-primary hover:underline truncate max-w-[120px]"
                  >
                    Task
                  </button>
                )}
                {entry.mission_id && onNavigateToMission && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMission(entry.mission_id!)}
                    className="text-xs text-primary hover:underline truncate max-w-[120px]"
                  >
                    Mission
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
