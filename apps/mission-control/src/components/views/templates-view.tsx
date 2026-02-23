"use client";

import { useState, useEffect, useCallback } from "react";
import { LayoutTemplate, Star, RefreshCw, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  loadCommunityUsecaseFavorites,
  saveCommunityUsecaseFavorites,
  toggleCommunityUsecaseFavorite,
} from "@/lib/community-usecase-favorites";
import { suggestAgentForTask } from "@/lib/agent-registry";
import { PageDescriptionBanner } from "@/components/guide/page-description-banner";
import { glassCardVariants, useReducedMotion } from "@/design-system";
import { motion } from "framer-motion";

interface CommunityUsecaseTemplate {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  category: string;
  rating: number;
  tags?: string[];
  source?: string;
  sourceDetail?: string;
  url?: string;
}

interface CreateTaskSeedDraft {
  title: string;
  description: string;
  priority: string;
  assigned_agent_id?: string;
}

function buildUsecaseSeed(template: CommunityUsecaseTemplate): CreateTaskSeedDraft {
  const suggested = suggestAgentForTask(`${template.title} ${template.summary}`);
  return {
    title: `Implement use case: ${template.title}`.slice(0, 200),
    description: [
      "You are implementing this OpenClaw community use case in OpenClaw Mission Control.",
      "",
      `Use case: ${template.title}`,
      `Category: ${template.category}`,
      `Source: ${template.sourceDetail || template.source || "community catalog"}`,
      `Reference: ${template.url || "N/A"}`,
      "",
      `Summary: ${template.summary}`,
      "",
      "Delivery criteria:",
      "1. Add or improve a concrete feature in this workspace.",
      "2. Keep the implementation production-safe (types, error handling, tests or verifiable behavior).",
      "3. Leave a short note in task comments describing what changed.",
    ].join("\n"),
    priority: template.rating >= 94 ? "high" : "medium",
    ...(suggested?.id ? { assigned_agent_id: suggested.id } : {}),
  };
}

interface TemplatesViewProps {
  onCreateTask?: (seed: CreateTaskSeedDraft) => void;
  userCanMutate?: boolean;
}

export function TemplatesView({ onCreateTask, userCanMutate = true }: TemplatesViewProps) {
  const [templates, setTemplates] = useState<CommunityUsecaseTemplate[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/openclaw/community-usecases");
      const data = (await res.json()) as { usecases?: CommunityUsecaseTemplate[]; error?: string };
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setTemplates(Array.isArray(data.usecases) ? data.usecases : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
    setFavoriteIds(loadCommunityUsecaseFavorites());
  }, [fetchTemplates]);

  const handleToggleFavorite = (id: string) => {
    const next = toggleCommunityUsecaseFavorite(favoriteIds, id);
    setFavoriteIds(next);
    saveCommunityUsecaseFavorites(next);
  };

  const handleUseTemplate = (template: CommunityUsecaseTemplate) => {
    if (!userCanMutate || !onCreateTask) {return;}
    onCreateTask(buildUsecaseSeed(template));
  };

  const filtered = templates.filter((t) => {
    if (!search.trim()) {return true;}
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const pinned = filtered.filter((t) => favoriteIds.includes(t.id));
  const rest = filtered.filter((t) => !favoriteIds.includes(t.id));

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-6 pt-4 shrink-0">
        <PageDescriptionBanner pageId="templates" />
      </div>
      <div className="px-6 py-4 border-b border-border/50 flex flex-wrap items-center gap-3 shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => void fetchTemplates()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}
        {loading && templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-12 h-12 mb-4 animate-spin opacity-50" />
            <p>Loading templates...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <LayoutTemplate className="w-12 h-12 mb-4 opacity-30" />
            <p>{search ? "No templates match your search." : "No templates available."}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pinned.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  Pinned Templates
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pinned.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isPinned={true}
                      onTogglePin={() => handleToggleFavorite(template.id)}
                      onUse={() => handleUseTemplate(template)}
                      canMutate={userCanMutate}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </div>
              </section>
            )}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {pinned.length > 0 ? "All Templates" : "Community Templates"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(pinned.length > 0 ? rest : filtered).map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isPinned={favoriteIds.includes(template.id)}
                    onTogglePin={() => handleToggleFavorite(template.id)}
                    onUse={() => handleUseTemplate(template)}
                    canMutate={userCanMutate}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function TemplateCard({
  template,
  isPinned,
  onTogglePin,
  onUse,
  canMutate,
  reduceMotion,
}: {
  template: CommunityUsecaseTemplate;
  isPinned: boolean;
  onTogglePin: () => void;
  onUse: () => void;
  canMutate: boolean;
  reduceMotion: boolean;
}) {
  const variants = reduceMotion ? {} : glassCardVariants;
  return (
    <motion.div
      variants={variants}
      className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/70 transition-colors flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-foreground line-clamp-2">{template.title}</h4>
        <button
          type="button"
          onClick={onTogglePin}
          className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
          aria-label={isPinned ? "Unpin template" : "Pin template"}
        >
          <Star
            className={`w-4 h-4 ${isPinned ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
          />
        </button>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{template.summary}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        <Badge variant="secondary" className="text-xs">
          {template.category}
        </Badge>
        {template.rating > 0 && (
          <Badge variant="outline" className="text-xs">
            ★ {template.rating}
          </Badge>
        )}
      </div>
      {canMutate && (
        <Button size="sm" className="w-full mt-2" onClick={onUse}>
          Use template
        </Button>
      )}
    </motion.div>
  );
}
