"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Plus,
  Rocket,
  FileText,
  ChevronDown,
  ChevronRight,
  Play,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/shared";
import { PageDescriptionBanner } from "@/components/guide/page-description-banner";
import { DEFAULT_WORKSPACE } from "@/lib/workspaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assigned_agent_id: string | null;
}

interface Mission {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  tasks?: Task[];
}

const VALID_STATUS = ["active", "paused", "completed", "archived"] as const;

export interface MissionsViewProps {
  /** When set, expand and scroll to this mission (e.g. from #missions?mission=id) */
  highlightMissionId?: string;
}

/** Parse error message from API response body (4xx/5xx). */
async function parseApiError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.error === "string") {return body.error;}
    if (typeof body?.errorInfo?.message === "string") {return body.errorInfo.message;}
    if (typeof body?.message === "string") {return body.message;}
  } catch {
    // Response may not be JSON
  }
  return res.status >= 500
    ? "Server error. Please try again later."
    : `Request failed (${res.status})`;
}

function getWorkspace(): string {
  if (typeof window === "undefined") {return DEFAULT_WORKSPACE;}
  return new URLSearchParams(window.location.search).get("workspace") || DEFAULT_WORKSPACE;
}

export function MissionsView({ highlightMissionId }: MissionsViewProps = {}) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [expandedMissions, setExpandedMissions] = useState<Set<string>>(new Set());
  const highlightedMissionRef = useRef<HTMLDivElement | null>(null);

  // Error state
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<{ message: string; action: string } | null>(null);

  // Edit state
  const [editMission, setEditMission] = useState<Mission | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState<string>("active");
  const [editSaving, setEditSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Mission | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toggleMission = (id: string) => {
    setExpandedMissions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {next.delete(id);}
      else {next.add(id);}
      return next;
    });
  };

  const loadInOrchestrator = (mission: Mission) => {
    if (!mission.tasks || mission.tasks.length === 0) {return;}
    try {
      const orchestratorTasks = mission.tasks.map((t) => ({
        title: t.title,
        description: t.description || "",
        priority: t.priority,
        agentId: t.assigned_agent_id || "main",
      }));
      window.localStorage.setItem(
        "mission-control:orchestrator-queue",
        JSON.stringify(orchestratorTasks)
      );
      window.location.hash = "orchestrate";
    } catch {
      setActionError({
        message: "Failed to load mission into orchestrator.",
        action: "load",
      });
    }
  };

  const fetchMissions = useCallback(async () => {
    setFetchError(null);
    setLoading(true);
    try {
      const workspace = getWorkspace();
      const res = await fetch(`/api/missions?workspace_id=${encodeURIComponent(workspace)}`);
      const data = await res.json();
      if (!res.ok) {
        const message = await parseApiError(res);
        setFetchError(message);
        setMissions([]);
        return;
      }
      setMissions(data.missions || []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load missions. Please try again.");
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMissions();
  }, [fetchMissions]);

  // Deep link: expand and scroll to mission when highlightMissionId is set
  useEffect(() => {
    if (!highlightMissionId || missions.length === 0) {return;}
    const exists = missions.some((m) => m.id === highlightMissionId);
    if (!exists) {return;}
    setExpandedMissions((prev) => new Set(prev).add(highlightMissionId));
    // Scroll after expand has rendered
    const t = setTimeout(() => {
      highlightedMissionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return () => clearTimeout(t);
  }, [highlightMissionId, missions]);

  const createMission = async () => {
    if (!newName.trim()) {return;}
    setCreating(true);
    setActionError(null);
    try {
      const workspace = getWorkspace();
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDesc.trim(),
          workspace_id: workspace,
        }),
      });
      if (!res.ok) {
        const message = await parseApiError(res);
        setActionError({ message, action: "create" });
        return;
      }
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
      await fetchMissions();
    } catch (err) {
      setActionError({
        message: err instanceof Error ? err.message : "Network error. Please try again.",
        action: "create",
      });
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (m: Mission) => {
    setEditMission(m);
    setEditName(m.name);
    setEditDesc(m.description || "");
    setEditStatus(m.status || "active");
    setActionError(null);
  };

  const saveMission = async () => {
    if (!editMission) {return;}
    setEditSaving(true);
    setActionError(null);
    try {
      const workspace = getWorkspace();
      const res = await fetch("/api/missions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editMission.id,
          workspace_id: workspace,
          name: editName.trim(),
          description: editDesc.trim(),
          status: editStatus,
        }),
      });
      if (!res.ok) {
        const message = await parseApiError(res);
        setActionError({ message, action: "update" });
        return;
      }
      setEditMission(null);
      await fetchMissions();
    } catch (err) {
      setActionError({
        message: err instanceof Error ? err.message : "Network error. Please try again.",
        action: "update",
      });
    } finally {
      setEditSaving(false);
    }
  };

  const deleteMission = async (m: Mission): Promise<boolean> => {
    setDeleteLoading(true);
    setActionError(null);
    try {
      const workspace = getWorkspace();
      const res = await fetch(
        `/api/missions?id=${encodeURIComponent(m.id)}&workspace_id=${encodeURIComponent(workspace)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const message = await parseApiError(res);
        setActionError({ message, action: "delete" });
        return false;
      }
      setDeleteConfirm(null);
      await fetchMissions();
      return true;
    } catch (err) {
      setActionError({
        message: err instanceof Error ? err.message : "Network error. Please try again.",
        action: "delete",
      });
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <PageDescriptionBanner pageId="missions" className="mb-4" />
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Your Missions</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void fetchMissions()}
            disabled={loading}
            title="Refresh missions"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Mission
          </Button>
        </div>
      </div>

      {/* Action error banner — visible on create/update/delete failure */}
      {actionError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            <span className="font-medium capitalize">{actionError.action}:</span> {actionError.message}
          </span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="shrink-0 rounded p-1 hover:bg-red-500/20 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fetch error banner */}
      {fetchError && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{fetchError}</span>
          <Button variant="outline" size="sm" onClick={() => void fetchMissions()}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : missions.length === 0 && !showCreate ? (
        <div className="text-center py-12 space-y-3">
          <Rocket className="w-10 h-10 mx-auto text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">
            No missions yet. Create your first mission.
          </p>
          <Button onClick={() => setShowCreate(true)}>Create Mission</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {showCreate && (
            <div className="bg-card border border-primary/20 rounded-lg p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mission Name</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Content Marketing Campaign"
                  maxLength={200}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px] resize-y"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What's the goal?"
                  maxLength={2000}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreate(false);
                    setActionError(null);
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={createMission} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Create
                </Button>
              </div>
            </div>
          )}
          {missions.map((m) => {
            const isExpanded = expandedMissions.has(m.id);
            const taskCount = m.tasks?.length || 0;
            const isHighlighted = highlightMissionId === m.id;
            return (
              <div
                key={m.id}
                ref={isHighlighted ? (el) => { highlightedMissionRef.current = el; } : undefined}
                className={`bg-card border rounded-lg p-5 hover:border-primary/50 transition-all flex flex-col gap-4 ${isHighlighted ? "border-primary/50 ring-1 ring-primary/20" : "border-border"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-primary" />
                      <span className="text-lg">{m.name}</span>
                    </div>
                    {m.description && (
                      <div className="text-sm text-muted-foreground mt-2 max-w-2xl">
                        {m.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="capitalize shrink-0">
                      {m.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(m)}
                      disabled={editSaving}
                      title="Edit mission"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(m)}
                      disabled={deleteLoading}
                      title="Delete mission"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {taskCount > 0 && (
                      <Button
                        size="sm"
                        variant="default"
                        className="gap-2 shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                        onClick={() => loadInOrchestrator(m)}
                      >
                        <Play className="w-4 h-4" /> Load in Orchestrator
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-4 mt-2">
                  <div className="flex items-center gap-2">{timeAgo(m.created_at)}</div>
                  {taskCount > 0 ? (
                    <button
                      onClick={() => toggleMission(m.id)}
                      className="flex items-center gap-1.5 hover:text-foreground font-medium transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 opacity-50">
                      <FileText className="w-3.5 h-3.5" /> 0 Tasks
                    </span>
                  )}
                </div>

                {isExpanded && taskCount > 0 && (
                  <div className="pt-2 border-t border-border mt-2 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {m.tasks?.map((task, idx) => (
                      <div
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/30 p-3 rounded-md border border-border/50"
                      >
                        <div className="flex text-muted-foreground font-mono text-xs w-6 shrink-0">
                          {(idx + 1).toString().padStart(2, "0")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-muted-foreground truncate opacity-80 mt-0.5">
                              {task.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase font-mono tracking-wider bg-background/50"
                          >
                            {task.priority}
                          </Badge>
                          <div className="text-xs bg-background/50 px-2 py-1 rounded-sm border border-border/50 text-muted-foreground truncate max-w-[120px]">
                            {task.assigned_agent_id || "main"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit mission dialog */}
      <Dialog open={!!editMission} onOpenChange={(open) => !open && setEditMission(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Mission</DialogTitle>
            <DialogDescription>
              Update mission name, description, or status.
            </DialogDescription>
            {actionError?.action === "update" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError.message}</span>
              </div>
            )}
          </DialogHeader>
          {editMission && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mission Name</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Mission name"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px] resize-y"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="What's the goal?"
                  maxLength={2000}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_STATUS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMission(null)}>
              Cancel
            </Button>
            <Button onClick={saveMission} disabled={editSaving}>
              {editSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete Mission?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteConfirm?.name}&quot;? This cannot be undone.
            </DialogDescription>
            {actionError?.action === "delete" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError.message}</span>
              </div>
            )}
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteConfirm) {
                  const ok = await deleteMission(deleteConfirm);
                  if (ok) {setDeleteConfirm(null);}
                }
              }}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
