"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings2, Users, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageDescriptionBanner } from "@/components/guide/page-description-banner";
import { apiFetch } from "@/lib/api-fetch";
import { DEFAULT_WORKSPACE } from "@/lib/workspaces";
import { useIsWorkspaceOwner } from "@/lib/hooks/use-workspace-role";

const WORKSPACE_COLORS: { id: string; label: string; className: string }[] = [
  { id: "amber", label: "Amber", className: "bg-amber-500" },
  { id: "emerald", label: "Emerald", className: "bg-emerald-500" },
  { id: "sky", label: "Sky", className: "bg-sky-500" },
  { id: "rose", label: "Rose", className: "bg-rose-500" },
  { id: "violet", label: "Violet", className: "bg-violet-500" },
  { id: "cyan", label: "Cyan", className: "bg-cyan-500" },
  { id: "orange", label: "Orange", className: "bg-orange-500" },
  { id: "slate", label: "Slate", className: "bg-slate-500" },
];

const ACCESS_MODES = [
  { id: "read-only", label: "Read only" },
  { id: "read-write", label: "Read & write" },
  { id: "full", label: "Full" },
] as const;

interface Workspace {
  id: string;
  label: string;
  color: string;
  folder_path: string | null;
  access_mode: string;
}

interface WorkspaceSettingsViewProps {
  workspaceId: string;
  onManageProfiles?: () => void;
  onWorkspaceDeleted?: () => void;
}

export default function WorkspaceSettingsView({
  workspaceId,
  onManageProfiles,
  onWorkspaceDeleted,
}: WorkspaceSettingsViewProps) {
  const isOwner = useIsWorkspaceOwner(workspaceId);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("slate");
  const [accessMode, setAccessMode] = useState("read-write");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchWorkspace = useCallback(async () => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/workspaces");
      const data = (await res.json()) as { workspaces?: Workspace[] };
      const ws = (data.workspaces ?? []).find((w) => w.id === workspaceId);
      if (ws) {
        setWorkspace(ws);
        setLabel(ws.label);
        setColor(ws.color ?? "slate");
        setAccessMode(ws.access_mode ?? "read-write");
      } else {
        setError("Workspace not found");
      }
    } catch {
      setError("Failed to load workspace");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleSave = async () => {
    if (!workspaceId || !isOwner) {return;}
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(
        `/api/workspaces?workspace_id=${encodeURIComponent(workspaceId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: workspaceId,
            label: label.trim(),
            color,
            access_mode: accessMode,
          }),
        }
      );
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? "Failed to update");
      }
      const data = (await res.json()) as { workspace?: Workspace };
      if (data.workspace) {
        setWorkspace(data.workspace);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!workspaceId || !isOwner || workspaceId === DEFAULT_WORKSPACE) {return;}
    setDeleting(true);
    setError(null);
    try {
      const res = await apiFetch(
        `/api/workspaces?id=${encodeURIComponent(workspaceId)}&workspace_id=${encodeURIComponent(workspaceId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? "Failed to delete");
      }
      setDeleteConfirm(false);
      onWorkspaceDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <PageDescriptionBanner pageId="workspace-settings" className="mb-4" />
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-6 text-center">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Only workspace owners can edit workspace settings. You have shared access to this workspace.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            You can view and contribute to tasks, chat, and agents.
          </p>
        </div>
      </div>
    );
  }

  if (error && !workspace) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchWorkspace}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <PageDescriptionBanner pageId="workspace-settings" className="mb-4" />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Workspace Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure name, color, and access for this workspace
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-border bg-card/50 p-5">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Workspace name"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {WORKSPACE_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${c.className} ${
                  color === c.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-muted-foreground/50"
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Access mode</label>
          <select
            value={accessMode}
            onChange={(e) => setAccessMode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none"
          >
            {ACCESS_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </Button>
          {onManageProfiles && (
            <Button variant="outline" onClick={onManageProfiles} className="gap-2">
              <Users className="w-4 h-4" />
              Manage profiles
            </Button>
          )}
        </div>
      </div>

      {workspaceId !== DEFAULT_WORKSPACE && (
        <div className="rounded-xl border border-border bg-card/50 p-5">
          <h3 className="text-sm font-semibold text-destructive mb-2">Danger zone</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Deleting this workspace will remove all tasks, missions, and employee data. This cannot be undone.
          </p>
          {!deleteConfirm ? (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => setDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete workspace
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                className="gap-2"
                onClick={handleDelete}
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirm delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
