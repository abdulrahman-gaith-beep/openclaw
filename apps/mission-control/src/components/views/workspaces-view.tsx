"use client";

import { useState, useCallback, useEffect } from "react";
import { Building2, Plus, Pencil, Trash2, RefreshCw, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageDescriptionBanner } from "@/components/guide/page-description-banner";
import { apiFetch } from "@/lib/api-fetch";

interface Workspace {
  id: string;
  label: string;
  color: string;
  folder_path?: string | null;
  access_mode?: string;
}

interface ProfileWorkspace {
  workspace_id: string;
  role: string;
  label: string;
  color: string;
}

interface WorkspacesViewProps {
  profileWorkspaces: ProfileWorkspace[];
  activeWorkspaceId: string;
  activeProfileId: string;
  onWorkspaceChange: (workspaceId: string) => void;
  onRefreshProfiles?: () => Promise<void>;
  isOwner?: boolean;
}

const WORKSPACE_COLORS = [
  "slate",
  "gray",
  "zinc",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

function colorToBg(color: string): string {
  const map: Record<string, string> = {
    slate: "bg-slate-500",
    gray: "bg-gray-500",
    zinc: "bg-zinc-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    yellow: "bg-yellow-500",
    lime: "bg-lime-500",
    green: "bg-green-500",
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    sky: "bg-sky-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    purple: "bg-purple-500",
    fuchsia: "bg-fuchsia-500",
    pink: "bg-pink-500",
    rose: "bg-rose-500",
  };
  return map[color] ?? "bg-slate-500";
}

export function WorkspacesView({
  profileWorkspaces,
  activeWorkspaceId,
  activeProfileId,
  onWorkspaceChange,
  onRefreshProfiles,
  isOwner = false,
}: WorkspacesViewProps) {
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createLabel, setCreateLabel] = useState("");
  const [createId, setCreateId] = useState("");
  const [createColor, setCreateColor] = useState("slate");
  const [creating, setCreating] = useState(false);
  const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Workspace | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/workspaces");
      const data = (await res.json()) as { workspaces?: Workspace[] };
      setAllWorkspaces(Array.isArray(data.workspaces) ? data.workspaces : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setAllWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWorkspaces();
  }, [fetchWorkspaces]);

  const linkedIds = new Set(profileWorkspaces.map((pw) => pw.workspace_id));
  const workspacesForProfile = allWorkspaces.filter((w) => linkedIds.has(w.id));

  const handleCreate = async () => {
    if (!createLabel.trim() || creating) {return;}
    const slugId = createId.trim() || createLabel.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!slugId) {return;}
    setCreating(true);
    try {
      await apiFetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slugId, label: createLabel.trim(), color: createColor }),
      });
      await apiFetch("/api/profiles/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: activeProfileId,
          workspace_id: slugId,
          role: "owner",
        }),
      });
      setShowCreate(false);
      setCreateLabel("");
      setCreateId("");
      setCreateColor("slate");
      await fetchWorkspaces();
      await onRefreshProfiles?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editWorkspace || !editLabel.trim() || editSaving) {return;}
    setEditSaving(true);
    try {
      await apiFetch(
        `/api/workspaces?workspace_id=${encodeURIComponent(editWorkspace.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editWorkspace.id, label: editLabel.trim() }),
        }
      );
      setEditWorkspace(null);
      setEditLabel("");
      await fetchWorkspaces();
      await onRefreshProfiles?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm || deleteLoading) {return;}
    setDeleteLoading(true);
    try {
      await apiFetch(
        `/api/workspaces?id=${encodeURIComponent(deleteConfirm.id)}&workspace_id=${encodeURIComponent(activeWorkspaceId)}`,
        { method: "DELETE" }
      );
      if (activeWorkspaceId === deleteConfirm.id) {
        const remaining = workspacesForProfile.filter((w) => w.id !== deleteConfirm.id);
        onWorkspaceChange(remaining[0]?.id ?? "golden");
      }
      setDeleteConfirm(null);
      await fetchWorkspaces();
      await onRefreshProfiles?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateClick = (ws: Workspace) => {
    setEditWorkspace(ws);
    setEditLabel(ws.label);
  };

  const handleDeleteClick = (ws: Workspace) => setDeleteConfirm(ws);

  const DEFAULT_WORKSPACE = "golden";

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-6 pt-4 shrink-0">
        <PageDescriptionBanner pageId="workspaces" />
      </div>
      <div className="px-6 py-4 border-b border-border/50 flex flex-wrap items-center gap-3 shrink-0">
        <Button variant="outline" size="sm" onClick={() => void fetchWorkspaces()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        {isOwner && (
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create workspace
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}
        {loading && workspacesForProfile.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-12 h-12 mb-4 animate-spin opacity-50" />
            <p>Loading workspaces...</p>
          </div>
        ) : workspacesForProfile.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mb-4 opacity-30" />
            <p>No workspaces yet.</p>
            {isOwner && (
              <Button className="mt-4" onClick={() => setShowCreate(true)}>
                Create your first workspace
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workspacesForProfile.map((ws) => {
              const pw = profileWorkspaces.find((p) => p.workspace_id === ws.id);
              const isActive = activeWorkspaceId === ws.id;
              const canEdit = isOwner && pw?.role === "owner";
              const canDelete = isOwner && pw?.role === "owner" && ws.id !== DEFAULT_WORKSPACE;
              return (
                <div
                  key={ws.id}
                  className={`p-4 rounded-xl border transition-colors flex flex-col gap-3 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-card/50 hover:bg-card/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${colorToBg(ws.color)}`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium truncate">{ws.label}</h4>
                      <p className="text-xs text-muted-foreground truncate">{ws.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button
                      variant={isActive ? "secondary" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => !isActive && onWorkspaceChange(ws.id)}
                      disabled={isActive}
                    >
                      {isActive ? "Current" : "Switch"}
                    </Button>
                    {canEdit && (
                      <Button variant="ghost" size="icon" onClick={() => handleUpdateClick(ws)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(ws)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace and link it to your profile. You will be the owner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={createLabel}
                onChange={(e) => setCreateLabel(e.target.value)}
                placeholder="My workspace"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">ID (optional)</label>
              <Input
                value={createId}
                onChange={(e) => setCreateId(e.target.value)}
                placeholder="Auto-generated from name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {WORKSPACE_COLORS.slice(0, 10).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCreateColor(c)}
                    className={`w-6 h-6 rounded-full ${colorToBg(c)} ${createColor === c ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} disabled={creating || !createLabel.trim()}>
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editWorkspace} onOpenChange={(open) => !open && setEditWorkspace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename workspace</DialogTitle>
            <DialogDescription>Update the workspace label.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Workspace name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWorkspace(null)}>
              Cancel
            </Button>
            <Button onClick={() => void handleUpdate()} disabled={editSaving || !editLabel.trim()}>
              {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteConfirm?.label}&quot;? All tasks and data
              in this workspace will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
