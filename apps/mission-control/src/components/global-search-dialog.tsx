"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Loader2, FileText, Rocket, Brain } from "lucide-react";
import { apiFetch } from "@/lib/api-fetch";

interface DashboardSearchResult {
  type: "task" | "mission" | "agent" | "specialist";
  id: string;
  title: string;
  subtitle?: string;
  viewId: string;
  hash?: string;
}

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onNavigate: (viewOrHash: string) => void;
}

const TYPE_ICONS = {
  task: FileText,
  mission: Rocket,
  agent: Brain,
  specialist: Brain,
};

export function GlobalSearchDialog({
  open,
  onOpenChange,
  workspaceId,
  onNavigate,
}: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DashboardSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    async (q: string) => {
      if (!q || q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ q, workspace_id: workspaceId });
        const res = await apiFetch(`/api/dashboard/search?${params.toString()}`);
        const data = (await res.json()) as { results?: DashboardSearchResult[] };
        setResults(data.results ?? []);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId]
  );

  useEffect(() => {
    if (!open) {return;}
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    if (!open) {return;}
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        const r = results[selectedIndex];
        onNavigate(r.hash ?? r.viewId);
        onOpenChange(false);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, selectedIndex, onNavigate, onOpenChange]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) {return;}
    const child = el.children[selectedIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  const handleSelect = (r: DashboardSearchResult) => {
    onNavigate(r.hash ?? r.viewId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search tasks, missions, specialists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search"
            autoComplete="off"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <div
          ref={listRef}
          className="max-h-[280px] overflow-y-auto py-2"
          role="listbox"
          aria-label="Search results"
        >
          {results.length === 0 && query.length >= 2 && !loading && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results for &quot;{query}&quot;
            </div>
          )}
          {results.length === 0 && query.length < 2 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}
          {results.map((r, i) => {
            const Icon = TYPE_ICONS[r.type];
            return (
              <button
                key={`${r.type}-${r.id}`}
                type="button"
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => handleSelect(r)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{r.title}</div>
                  {r.subtitle && (
                    <div className="text-xs text-muted-foreground truncate">{r.subtitle}</div>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                  {r.type}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">⌘K</kbd> to
          open • <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">↑↓</kbd>{" "}
          to navigate • <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">↵</kbd>{" "}
          to select
        </div>
      </DialogContent>
    </Dialog>
  );
}
