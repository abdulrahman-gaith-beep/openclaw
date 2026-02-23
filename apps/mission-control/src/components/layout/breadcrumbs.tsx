"use client";

import { ChevronRight } from "lucide-react";
import { getViewLabel, type ViewId } from "@/lib/dashboard-views";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  activeView: ViewId;
  workspaceLabel?: string | null;
  className?: string;
}

export function Breadcrumbs({ activeView, workspaceLabel, className }: BreadcrumbsProps) {
  const viewLabel = getViewLabel(activeView);
  const showWorkspace = workspaceLabel && workspaceLabel.trim() !== "";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}
    >
      {showWorkspace ? (
        <>
          <span className="truncate max-w-[140px]" title={workspaceLabel}>
            {workspaceLabel}
          </span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden />
        </>
      ) : null}
      <span className="font-medium text-foreground/90" aria-current="page">
        {viewLabel}
      </span>
    </nav>
  );
}
