import { test, expect } from "@playwright/test";
import { NextRequest } from "next/server";
import { GET } from "../src/app/api/[...path]/route";
import { deepMerge } from "../src/lib/i18n";

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
});
