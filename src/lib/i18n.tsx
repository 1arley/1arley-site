"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type Dict, type Locale } from "@/lib/i18n-data";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "pt" || saved === "en") setLocaleState(saved);
    } catch {
      /* noop */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dict[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
