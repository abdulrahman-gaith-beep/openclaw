"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useDashboardLocale } from "@/lib/use-dashboard-locale";
import type { GuideLocale } from "@/lib/dashboard-guide-content";

interface DashboardLocaleContextValue {
  locale: GuideLocale;
  setLocale: (locale: GuideLocale) => void;
  isRtl: boolean;
}

const DashboardLocaleContext = createContext<DashboardLocaleContextValue | null>(null);

export function DashboardLocaleProvider({ children }: { children: ReactNode }) {
  const value = useDashboardLocale();
  return (
    <DashboardLocaleContext.Provider value={value}>
      {children}
    </DashboardLocaleContext.Provider>
  );
}

export function useDashboardLocaleContext(): DashboardLocaleContextValue {
  const ctx = useContext(DashboardLocaleContext);
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      isRtl: false,
    };
  }
  return ctx;
}
