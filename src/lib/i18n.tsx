"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type Dict, type Locale } from "@/lib/i18n-data";
import { getSiteContent } from "@/services/cms";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "locale";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/** Merge profundo: objetos se combinam, arrays e primitivos são substituídos. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override) || !isPlainObject(base)) {
    return (override === undefined ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    out[key] = deepMerge((base as Record<string, unknown>)[key], value);
  }
  return out as T;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [overrides, setOverrides] = useState<Partial<Record<Locale, Partial<Dict>>>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "pt" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved === "pt" ? "pt-BR" : "en";
      }
    } catch {
      /* noop */
    }
    // Conteúdo editável do portfólio (CMS). Sem backend, cai no dicionário estático.
    getSiteContent()
      .then((data) => {
        if (data && typeof data === "object") setOverrides(data);
      })
      .catch(() => {
        /* fallback: dicionário estático */
      });
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

  const t = useMemo(
    () => deepMerge(dict[locale], overrides[locale]),
    [locale, overrides],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
