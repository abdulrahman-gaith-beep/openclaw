"use client";

import { useCallback, useEffect, useState } from "react";
import type { GuideLocale } from "@/lib/dashboard-guide-content";

const STORAGE_KEY = "mc:guide-locale";
const LOCALE_CHANGE_EVENT = "mc:guide-locale-changed";

function getStoredLocale(): GuideLocale | null {
  if (typeof window === "undefined") {return null;}
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ar-SA" || stored === "en") {return stored;}
  return null;
}

function getDefaultLocale(): GuideLocale {
  if (typeof window === "undefined") {return "en";}
  const navLang = navigator.language?.toLowerCase() ?? "";
  if (navLang.startsWith("ar")) {return "ar-SA";}
  return "en";
}

function getInitialLocale(): GuideLocale {
  const stored = getStoredLocale();
  if (stored) {return stored;}
  return getDefaultLocale();
}

function subscribeToLocaleChange(onChange: () => void) {
  if (typeof window === "undefined") {return () => {};}
  const handler = () => onChange();
  window.addEventListener(LOCALE_CHANGE_EVENT, handler);
  return () => window.removeEventListener(LOCALE_CHANGE_EVENT, handler);
}

export function useDashboardLocale(): {
  locale: GuideLocale;
  setLocale: (locale: GuideLocale) => void;
  isRtl: boolean;
} {
  const [locale, setLocaleState] = useState<GuideLocale>(getInitialLocale);

  const setLocale = useCallback((next: GuideLocale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
    setLocaleState(next);
  }, []);

  useEffect(() => {
    const unsub = subscribeToLocaleChange(() => {
      const next = getStoredLocale() ?? getDefaultLocale();
      setLocaleState(next);
    });
    return unsub;
  }, []);

  return {
    locale,
    setLocale,
    isRtl: locale === "ar-SA",
  };
}
