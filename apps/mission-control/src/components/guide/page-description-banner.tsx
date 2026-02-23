"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, HelpCircle } from "lucide-react";
import { getPage, getLabel } from "@/lib/dashboard-guide-content";
import { useDashboardLocaleContext } from "@/lib/dashboard-locale-context";

const BANNER_DISMISSED_KEY = "mc:guide-banner-dismissed";

function getDismissedPages(): Set<string> {
  if (typeof window === "undefined") {return new Set();}
  try {
    const raw = window.localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!raw) {return new Set();}
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function setDismissedPage(pageId: string, dismissed: boolean) {
  if (typeof window === "undefined") {return;}
  const set = getDismissedPages();
  if (dismissed) {
    set.add(pageId);
  } else {
    set.delete(pageId);
  }
  window.localStorage.setItem(BANNER_DISMISSED_KEY, JSON.stringify([...set]));
}

interface PageDescriptionBannerProps {
  pageId: string;
  className?: string;
}

export function PageDescriptionBanner({ pageId, className = "" }: PageDescriptionBannerProps) {
  const { locale, isRtl } = useDashboardLocaleContext();
  const page = getPage(locale, pageId);
  const [collapsed, setCollapsed] = useState(true);
  const [dismissed, setDismissedState] = useState(false);

  useEffect(() => {
    setDismissedState(getDismissedPages().has(pageId));
  }, [pageId]);

  if (!page || dismissed) {return null;}

  const handleDismiss = () => {
    setDismissedPage(pageId, true);
    setDismissedState(true);
  };

  return (
    <div
      className={`rounded-xl border border-primary/20 bg-primary/5 overflow-hidden ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
      role="region"
      aria-label={getLabel(locale, "whatIsThisPage")}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex-1 flex items-center justify-between gap-2 text-left min-w-0"
        >
          <span className="text-sm font-medium text-foreground">
            {getLabel(locale, "whatIsThisPage")}
          </span>
          {collapsed ? (
            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
          )}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {!collapsed && (
        <div className={`px-4 pb-4 pt-0 ${isRtl ? "text-right" : "text-left"}`}>
          <h3 className="text-sm font-semibold text-foreground mb-1">{page.title}</h3>
          <p className="text-sm text-muted-foreground">{page.description}</p>
        </div>
      )}
    </div>
  );
}
