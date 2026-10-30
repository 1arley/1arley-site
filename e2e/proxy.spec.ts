import { test, expect } from "@playwright/test";
import { NextRequest } from "next/server";
import { GET, PUT } from "../src/app/api/[...path]/route";
import { POST as loginPOST } from "../src/app/api/v1/auth/login/route";
import { POST as logoutPOST } from "../src/app/api/v1/auth/logout/route";
import {
  ADMIN_SESSION_COOKIE,
  DEFAULT_MAX_AGE_SECONDS,
  MAX_COOKIE_AGE_SECONDS,
  deriveMaxAgeFromJwt,
  isSameOriginMutation,
  isValidInternalNextPath,
  isWellFormedJwt,
  sanitizeNextPath,
} from "../src/lib/admin-cookie";
import { deepMerge, resolveLocale } from "../src/lib/i18n";

test.describe("resolveLocale unit tests [DIR-02]", () => {
  test("prioritizes valid ?lang=pt|en over localStorage and navigator.language", () => {
    expect(
      resolveLocale({ search: "?lang=en", stored: "pt", navigatorLanguage: "pt-BR" }),
    ).toEqual({ locale: "en", fromUrl: true });
    expect(
      resolveLocale({ search: "?lang=pt", stored: "en", navigatorLanguage: "en-US" }),
    ).toEqual({ locale: "pt", fromUrl: true });
  });

  test("ignores invalid ?lang values and falls back to localStorage", () => {
    expect(
      resolveLocale({ search: "?lang=fr", stored: "en", navigatorLanguage: "pt-BR" }),
    ).toEqual({ locale: "en", fromUrl: false });
    expect(
      resolveLocale({ search: "?lang=javascript:alert(1)", stored: "pt" }),
    ).toEqual({ locale: "pt", fromUrl: false });
  });

  test("uses navigator.language (pt* -> pt, others -> en) when URL and storage are absent or invalid", () => {
    expect(
      resolveLocale({ search: "?lang=invalid", stored: "invalid", navigatorLanguage: "pt-BR" }),
    ).toEqual({ locale: "pt", fromUrl: false });
    expect(
      resolveLocale({ search: "", stored: null, navigatorLanguage: "en-GB" }),
    ).toEqual({ locale: "en", fromUrl: false });
    expect(
      resolveLocale({ search: "", stored: null, navigatorLanguage: "es-ES" }),
    ).toEqual({ locale: "en", fromUrl: false });
  });

  test("falls back to pt when all inputs are missing or invalid", () => {
    expect(resolveLocale({})).toEqual({ locale: "pt", fromUrl: false });
    expect(
      resolveLocale({ search: "?foo=bar", stored: "de", navigatorLanguage: "" }),
    ).toEqual({ locale: "pt", fromUrl: false });
  });
});

test.describe("deepMerge unit tests [BUG-04 / TEST-02]", () => {
  const base = {
    title: "Arthur",
    count: 6,
    tags: ["ts", "go"],
    nested: {
      subtitle: "Backend",
      items: [{ id: "01", name: "API" }],
    },
  };

  test("preserves base when override is null, undefined or non-object", () => {
    expect(deepMerge(base, null)).toEqual(base);
    expect(deepMerge(base, undefined)).toEqual(base);
    expect(deepMerge(base, "invalid")).toEqual(base);
    expect(deepMerge(base, 42)).toEqual(base);
  });

  test("does not overwrite arrays or nested objects with null or wrong types", () => {
    const merged = deepMerge(base, {
      title: null,
      tags: null,
      nested: {
        subtitle: "Full-Stack",
        items: null,
      },
    });

    expect(merged.title).toBe("Arthur");
    expect(merged.tags).toEqual(["ts", "go"]);
    expect(merged.nested.subtitle).toBe("Full-Stack");
    expect(merged.nested.items).toEqual([{ id: "01", name: "API" }]);
  });

  test("replaces arrays when override provides a valid array", () => {
    const merged = deepMerge(base, {
      tags: ["rust"],
    });
    expect(merged.tags).toEqual(["rust"]);
  });

  test("falls back to base string when override string is empty or whitespace [DIR-01]", () => {
    const merged = deepMerge(base, {
      title: "",
      nested: {
        subtitle: "   ",
      },
    });
    expect(merged.title).toBe("Arthur");
    expect(merged.nested.subtitle).toBe("Backend");
  });
});

test.describe("proxyRequest unit tests [SEC-01]", () => {
  const originalEnv = process.env.API_BASE_URL;
  const originalFetch = globalThis.fetch;

  test.beforeEach(() => {
    process.env.API_BASE_URL = "https://cms.1arley.internal/api";
  });

  test.afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.API_BASE_URL;
    } else {
      process.env.API_BASE_URL = originalEnv;
    }
    globalThis.fetch = originalFetch;
  });

  test("rejects scheme injection (/api/http:/host) with 400 and never calls upstream", async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response("{}");
    };

    const req = new NextRequest("http://localhost:3100/api/http:/evil.example/pwn");
    const res = await GET(req, {
      params: Promise.resolve({ path: ["http:", "evil.example", "pwn"] }),
    });

    expect(res.status).toBe(400);
    expect(called).toBe(false);
  });

  test("rejects path traversal (..) and encoded traversal (%2e%2e) with 400", async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response("{}");
    };

    const req1 = new NextRequest("http://localhost:3100/api/v1/../admin");
    const res1 = await GET(req1, {
      params: Promise.resolve({ path: ["v1", "..", "admin"] }),
    });
    expect(res1.status).toBe(400);

    const req2 = new NextRequest("http://localhost:3100/api/v1/%2e%2e/admin");
    const res2 = await GET(req2, {
      params: Promise.resolve({ path: ["v1", "%2e%2e", "admin"] }),
    });
    expect(res2.status).toBe(400);
    expect(called).toBe(false);
  });

  test("rejects protocol-relative double slashes (//) and control chars with 400", async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response("{}");
    };

    const req1 = new NextRequest("http://localhost:3100/api//evil.example/v1/site");
    const res1 = await GET(req1, {
      params: Promise.resolve({ path: ["evil.example", "v1", "site"] }),
    });
    expect(res1.status).toBe(400);

    const req2 = new NextRequest("http://localhost:3100/api/v1/site");
    const res2 = await GET(req2, {
      params: Promise.resolve({ path: ["v1", "site\u0000"] }),
    });
    expect(res2.status).toBe(400);
    expect(called).toBe(false);
  });

  test("returns static fallback { data: {} } when upstream fetch throws on GET /api/v1/site", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("fetch failed: ECONNREFUSED");
    };

    const req = new NextRequest("http://localhost:3100/api/v1/site");
    const res = await GET(req, {
      params: Promise.resolve({ path: ["v1", "site"] }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: {} });
  });

  test("returns 503 when upstream fetch throws on non-site endpoints", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("fetch failed: ECONNREFUSED");
    };

    const req = new NextRequest("http://localhost:3100/api/v1/posts");
    const res = await GET(req, {
      params: Promise.resolve({ path: ["v1", "posts"] }),
    });

    expect(res.status).toBe(503);
  });

  test("forwards valid path strictly within API_BASE_URL origin and path prefix", async () => {
    let requestedUrl = "";
    globalThis.fetch = async (input) => {
      requestedUrl = input instanceof URL ? input.toString() : String(input);
      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const req = new NextRequest("http://localhost:3100/api/v1/site?lang=pt");
    const res = await GET(req, {
      params: Promise.resolve({ path: ["v1", "site"] }),
    });

    expect(res.status).toBe(200);
    expect(requestedUrl).toBe("https://cms.1arley.internal/api/v1/site?lang=pt");
    expect(await res.json()).toEqual({ data: { ok: true } });
  });

  test("attaches Authorization: Bearer from admin_session cookie and NEVER forwards Cookie header [SEC-03]", async () => {
    let forwardedHeaders: Headers | null = null;
    globalThis.fetch = async (_input, init) => {
      forwardedHeaders = new Headers(init?.headers);
      return new Response(JSON.stringify({ data: { saved: true } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const req = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "PUT",
      headers: {
        origin: "http://localhost:3100",
        cookie: `${ADMIN_SESSION_COOKIE}=hdr.pld.sig; other_cookie=secret`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ pt: {} }),
    });

    const res = await PUT(req, {
      params: Promise.resolve({ path: ["v1", "site"] }),
    });

    expect(res.status).toBe(200);
    expect(forwardedHeaders).not.toBeNull();
    expect(forwardedHeaders!.get("authorization")).toBe("Bearer hdr.pld.sig");
    expect(forwardedHeaders!.get("cookie")).toBeNull();
  });

  test("rejects state-changing requests with cross-origin Origin or missing CSRF headers with 403 [SEC-03]", async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response("{}");
    };

    const crossOriginReq = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "PUT",
      headers: {
        origin: "https://evil.example",
        cookie: `${ADMIN_SESSION_COOKIE}=hdr.pld.sig`,
      },
      body: "{}",
    });
    const res1 = await PUT(crossOriginReq, {
      params: Promise.resolve({ path: ["v1", "site"] }),
    });
    expect(res1.status).toBe(403);

    const noOriginCrossSiteReq = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "PUT",
      headers: {
        "sec-fetch-site": "cross-site",
        cookie: `${ADMIN_SESSION_COOKIE}=hdr.pld.sig`,
      },
      body: "{}",
    });
    const res2 = await PUT(noOriginCrossSiteReq, {
      params: Promise.resolve({ path: ["v1", "site"] }),
    });
    expect(res2.status).toBe(403);
    expect(called).toBe(false);
  });

  test("POST /api/v1/auth/login sets HttpOnly SameSite=Strict cookie and strips access_token from JSON body [SEC-03]", async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const payloadB64 = Buffer.from(
      JSON.stringify({ sub: "1", role: "ADMIN", exp: nowSec + 3600 }),
    ).toString("base64url");
    const fakeToken = `eyJhbGciOiJIUzI1NiJ9.${payloadB64}.signature123`;

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          access_token: fakeToken,
          user: { id: "1", email: "admin@1arley.me", role: "ADMIN" },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );

    const req = new NextRequest("http://localhost:3100/api/v1/auth/login", {
      method: "POST",
      headers: {
        origin: "http://localhost:3100",
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: "admin@1arley.me", password: "secret" }),
    });

    const res = await loginPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      user: { id: "1", email: "admin@1arley.me", role: "ADMIN" },
    });
    expect(body.access_token).toBeUndefined();

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${ADMIN_SESSION_COOKIE}=${fakeToken}`);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Strict/i);
    expect(setCookie).toMatch(/Path=\//i);
    expect(setCookie).toMatch(/Max-Age=3(59\d|600)/);
  });

  test("POST /api/v1/auth/logout expires admin_session cookie with Max-Age=0 and returns 204 [SEC-03]", async () => {
    const req = new NextRequest("http://localhost:3100/api/v1/auth/logout", {
      method: "POST",
      headers: {
        origin: "http://localhost:3100",
      },
    });
    const res = await logoutPOST(req);
    expect(res.status).toBe(204);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${ADMIN_SESSION_COOKIE}=;`);
    expect(setCookie).toMatch(/Max-Age=0/i);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Strict/i);
  });
});

test.describe("SEC-03 unit tests (next validation, Max-Age from exp, CSRF Origin, JWT format)", () => {
  test("validates internal next path and rejects scheme, //, backslash, control chars and empty values", () => {
    expect(isValidInternalNextPath("/admin/site")).toBe(true);
    expect(isValidInternalNextPath("/admin/users?page=2")).toBe(true);

    expect(isValidInternalNextPath("")).toBe(false);
    expect(isValidInternalNextPath(null)).toBe(false);
    expect(isValidInternalNextPath(undefined)).toBe(false);
    expect(isValidInternalNextPath("https://evil.com")).toBe(false);
    expect(isValidInternalNextPath("http://evil.com/admin")).toBe(false);
    expect(isValidInternalNextPath("javascript:alert(1)")).toBe(false);
    expect(isValidInternalNextPath("//evil.com")).toBe(false);
    expect(isValidInternalNextPath("/admin//evil")).toBe(false);
    expect(isValidInternalNextPath("/\\evil.com")).toBe(false);
    expect(isValidInternalNextPath("/admin\u0000/site")).toBe(false);
    expect(isValidInternalNextPath("/admin\n/site")).toBe(false);
    expect(isValidInternalNextPath("/%2f%2fevil.com")).toBe(false);
    expect(isValidInternalNextPath("/login")).toBe(false);

    expect(sanitizeNextPath("/admin/users")).toBe("/admin/users");
    expect(sanitizeNextPath("https://evil.com")).toBe("/admin/site");
    expect(sanitizeNextPath("//evil.com")).toBe("/admin/site");
  });

  test("derives Max-Age from JWT exp with ceiling and handles expired or malformed tokens", () => {
    const nowMs = 1_700_000_000_000;
    const nowSec = Math.floor(nowMs / 1000);

    const makeJwt = (payload: Record<string, unknown>) =>
      `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.sig`;

    expect(deriveMaxAgeFromJwt(makeJwt({ exp: nowSec + 1800 }), nowMs)).toBe(1800);
    expect(deriveMaxAgeFromJwt(makeJwt({ exp: nowSec - 10 }), nowMs)).toBe(0);
    expect(
      deriveMaxAgeFromJwt(makeJwt({ exp: nowSec + 60 * 60 * 24 * 30 }), nowMs),
    ).toBe(MAX_COOKIE_AGE_SECONDS);
    expect(deriveMaxAgeFromJwt(makeJwt({ sub: "1" }), nowMs)).toBe(
      DEFAULT_MAX_AGE_SECONDS,
    );
    expect(deriveMaxAgeFromJwt("not-a-jwt", nowMs)).toBe(DEFAULT_MAX_AGE_SECONDS);

    expect(isWellFormedJwt("a.b.c")).toBe(true);
    expect(isWellFormedJwt("a.b")).toBe(false);
    expect(isWellFormedJwt("a..c")).toBe(false);
    expect(isWellFormedJwt("")).toBe(false);
  });

  test("isSameOriginMutation allows GET and same-origin mutations, rejecting foreign Origin", () => {
    const getReq = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "GET",
    });
    expect(isSameOriginMutation(getReq)).toBe(true);

    const sameOriginPost = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "POST",
      headers: { origin: "http://localhost:3100" },
    });
    expect(isSameOriginMutation(sameOriginPost)).toBe(true);

    const sameFetchSitePost = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "POST",
      headers: { "sec-fetch-site": "same-origin" },
    });
    expect(isSameOriginMutation(sameFetchSitePost)).toBe(true);

    const foreignOriginPost = new NextRequest("http://localhost:3100/api/v1/site", {
      method: "POST",
      headers: { origin: "https://attacker.example" },
    });
    expect(isSameOriginMutation(foreignOriginPost)).toBe(false);
  });
});
