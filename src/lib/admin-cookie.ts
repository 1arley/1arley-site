import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
export const MAX_COOKIE_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days ceiling

const CONTROL_CHAR_RE = /[\x00-\x1f\x7f]/;
const JWT_SEGMENT_RE = /^[A-Za-z0-9_-]+$/;
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isWellFormedJwt(token: string | null | undefined): token is string {
  if (typeof token !== "string" || token.length === 0) {
    return false;
  }
  if (/[\x00-\x20\x7f]/.test(token)) {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }
  return parts.every((part) => part.length > 0 && JWT_SEGMENT_RE.test(part));
}

function decodeBase64UrlJson(segment: string): Record<string, unknown> | null {
  try {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

export function deriveMaxAgeFromJwt(token: string, nowMs = Date.now()): number {
  if (!isWellFormedJwt(token)) {
    return DEFAULT_MAX_AGE_SECONDS;
  }
  const [, payloadSegment] = token.split(".");
  const payload = decodeBase64UrlJson(payloadSegment);
  if (!payload || typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
    return DEFAULT_MAX_AGE_SECONDS;
  }

  const remainingSeconds = Math.floor(payload.exp - nowMs / 1000);
  if (remainingSeconds <= 0) {
    return 0;
  }
  return Math.min(remainingSeconds, MAX_COOKIE_AGE_SECONDS);
}

export function getAdminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: Math.max(0, Math.floor(maxAgeSeconds)),
  };
}

export function isSameOriginMutation(request: NextRequest): boolean {
  const method = request.method.toUpperCase();
  if (!MUTATING_METHODS.has(method)) {
    return true;
  }

  const originHeader = request.headers.get("origin");
  if (originHeader !== null) {
    let parsedOrigin: string;
    try {
      parsedOrigin = new URL(originHeader).origin;
    } catch {
      return false;
    }

    if (parsedOrigin === request.nextUrl.origin) {
      return true;
    }

    const host =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      request.headers.get("host")?.trim();
    if (host) {
      const proto =
        request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
        request.nextUrl.protocol.replace(":", "");
      if (parsedOrigin === `${proto}://${host}`) {
        return true;
      }
    }

    return false;
  }

  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  return secFetchSite === "same-origin";
}

export function isValidInternalNextPath(
  nextParam: string | null | undefined,
): nextParam is string {
  if (typeof nextParam !== "string" || nextParam.length === 0) {
    return false;
  }
  if (
    !nextParam.startsWith("/") ||
    nextParam.includes("//") ||
    nextParam.includes("\\") ||
    CONTROL_CHAR_RE.test(nextParam)
  ) {
    return false;
  }

  const rawPathPart = nextParam.split(/[?#]/, 1)[0] ?? "";
  if (rawPathPart.includes(":")) {
    return false;
  }

  try {
    const decoded = decodeURIComponent(nextParam);
    if (
      !decoded.startsWith("/") ||
      decoded.includes("//") ||
      decoded.includes("\\") ||
      CONTROL_CHAR_RE.test(decoded)
    ) {
      return false;
    }
    const decodedPathPart = decoded.split(/[?#]/, 1)[0] ?? "";
    if (decodedPathPart.includes(":")) {
      return false;
    }
  } catch {
    return false;
  }

  try {
    const parsed = new URL(nextParam, "http://localhost");
    if (
      parsed.origin !== "http://localhost" ||
      !parsed.pathname.startsWith("/") ||
      parsed.pathname.startsWith("//")
    ) {
      return false;
    }
    if (parsed.pathname === "/login" || parsed.pathname.startsWith("/login/")) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

export function sanitizeNextPath(
  nextParam: string | null | undefined,
  fallback = "/admin/site",
): string {
  return isValidInternalNextPath(nextParam) ? nextParam : fallback;
}

export function getRuntimeApiBaseUrl(): string {
  const apiBaseUrl = process.env.API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      "API_BASE_URL nao esta definida. Configure a URL da API no ambiente de runtime.",
    );
  }

  return apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
}

export function isValidProxyPath(path: string[], rawPathname?: string): boolean {
  if (!Array.isArray(path) || path.length === 0) {
    return false;
  }

  if (rawPathname) {
    if (
      rawPathname.includes("//") ||
      rawPathname.includes("\\") ||
      CONTROL_CHAR_RE.test(rawPathname)
    ) {
      return false;
    }
    try {
      const decodedPathname = decodeURIComponent(rawPathname);
      if (
        decodedPathname.includes("//") ||
        decodedPathname.includes("\\") ||
        CONTROL_CHAR_RE.test(decodedPathname)
      ) {
        return false;
      }
    } catch {
      return false;
    }
  }

  for (const segment of path) {
    if (!segment) return false;

    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return false;
    }

    for (const candidate of [segment, decoded]) {
      if (
        candidate === "." ||
        candidate === ".." ||
        candidate.includes("..") ||
        candidate.includes(":") ||
        candidate.includes("/") ||
        candidate.includes("\\") ||
        CONTROL_CHAR_RE.test(candidate)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function resolveUpstreamUrl(
  apiBaseUrl: string,
  path: string[],
  search: string,
  rawPathname?: string,
): URL | null {
  if (!isValidProxyPath(path, rawPathname)) {
    return null;
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`);
  } catch {
    return null;
  }

  if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
    return null;
  }

  const relativePath = path
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  let targetUrl: URL;
  try {
    targetUrl = new URL(relativePath, baseUrl);
  } catch {
    return null;
  }

  if (
    targetUrl.origin !== baseUrl.origin ||
    !targetUrl.pathname.startsWith(baseUrl.pathname)
  ) {
    return null;
  }

  targetUrl.search = search;
  return targetUrl;
}
