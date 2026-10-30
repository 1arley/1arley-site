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
  localizeHref: (href: string) => string;
  t: Dict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "locale";
const SUPPORTED_LOCALES: readonly Locale[] = ["pt", "en"];

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export interface ResolveLocaleInput {
  search?: string | null;
  stored?: string | null;
  navigatorLanguage?: string | null;
}

export interface ResolveLocaleResult {
  locale: Locale;
  fromUrl: boolean;
}

/**
 * Resolve o idioma na ordem:
 * 1) ?lang=pt|en na URL (validado contra lista fixa)
 * 2) localStorage ("pt" | "en")
 * 3) navigator.language (pt* -> "pt", demais -> "en") quando informado
 * 4) fallback padrão "pt"
 */
export function resolveLocale({
  search,
  stored,
  navigatorLanguage,
}: ResolveLocaleInput): ResolveLocaleResult {
  if (search) {
    const raw = search.startsWith("?") ? search.slice(1) : search;
    const params = new URLSearchParams(raw);
    const langParam = params.get("lang")?.trim().toLowerCase();
    if (isSupportedLocale(langParam)) {
      return { locale: langParam, fromUrl: true };
    }
  }

  const normalizedStored = stored?.trim().toLowerCase();
  if (isSupportedLocale(normalizedStored)) {
    return { locale: normalizedStored, fromUrl: false };
  }

  if (navigatorLanguage && navigatorLanguage.trim().length > 0) {
    const nav = navigatorLanguage.trim().toLowerCase();
    return {
      locale: nav.startsWith("pt") ? "pt" : "en",
      fromUrl: false,
    };
  }

  return { locale: "pt", fromUrl: false };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/** Merge profundo: objetos se combinam, arrays e primitivos são substituídos (null-safe). */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) {
    return base;
  }
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(override)) {
      return base;
    }
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(override)) {
      if (value === undefined || value === null) continue;
      out[key] = deepMerge((base as Record<string, unknown>)[key], value);
    }
    return out as T;
  }
  if (base !== undefined && typeof override !== typeof base) {
    return base;
  }
  if (
    typeof base === "string" &&
    typeof override === "string" &&
    override.trim() === "" &&
    base !== ""
  ) {
    return base;
  }
  return override as T;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [hasUrlLang, setHasUrlLang] = useState(false);
  const [overrides, setOverrides] = useState<Partial<Record<Locale, Partial<Dict>>>>({});

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        // Decisão registrada [DIR-02]: sem ?lang e sem localStorage, mantém "pt"
        // como padrão do portfólio para evitar flash pós-hidratação em navegadores en-US.
        const resolved = resolveLocale({
          search: window.location.search,
          stored: saved,
        });
        setLocaleState(resolved.locale);
        setHasUrlLang(resolved.fromUrl);
        document.documentElement.lang = resolved.locale === "pt" ? "pt-BR" : "en";
        if (resolved.fromUrl) {
          window.localStorage.setItem(STORAGE_KEY, resolved.locale);
        }
      } catch {
        /* noop */
      }
    });
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
    if (!isSupportedLocale(l)) return;
    setLocaleState(l);
    setHasUrlLang(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", l);
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    } catch {
      /* noop */
    }
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  }, []);

  const localizeHref = useCallback(
    (href: string) => {
      if (!hasUrlLang || !href.startsWith("/") || href.startsWith("//")) {
        return href;
      }
      const [pathAndQuery, hash = ""] = href.split("#");
      const [pathname, query = ""] = pathAndQuery.split("?");
      const params = new URLSearchParams(query);
      params.set("lang", locale);
      const qs = params.toString();
      return `${pathname}${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`;
    },
    [hasUrlLang, locale],
  );

  const t = useMemo(
    () => deepMerge(dict[locale], overrides[locale]),
    [locale, overrides],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, localizeHref, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
