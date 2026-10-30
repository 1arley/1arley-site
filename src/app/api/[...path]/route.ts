import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const CONTROL_CHAR_RE = /[\x00-\x1f\x7f]/;

function getRuntimeApiBaseUrl(): string {
  const apiBaseUrl = process.env.API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      "API_BASE_URL nao esta definida. Configure a URL da API no ambiente de runtime.",
    );
  }

  return apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
}

function isValidProxyPath(path: string[], rawPathname?: string): boolean {
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

function resolveUpstreamUrl(
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

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;

  if (!isValidProxyPath(path, request.nextUrl.pathname)) {
    return NextResponse.json(
      { message: "Caminho de API invalido." },
      { status: 400 },
    );
  }

  const joinedPath = path.join("/");

  let apiBaseUrl: string;
  try {
    apiBaseUrl = getRuntimeApiBaseUrl();
  } catch (error) {
    if (request.method === "GET" && joinedPath === "v1/site") {
      return NextResponse.json({ data: {} });
    }

    const message =
      error instanceof Error ? error.message : "Falha ao resolver API_BASE_URL.";

    return NextResponse.json({ message }, { status: 503 });
  }

  const targetUrl = resolveUpstreamUrl(
    apiBaseUrl,
    path,
    request.nextUrl.search,
    request.nextUrl.pathname,
  );

  if (!targetUrl) {
    return NextResponse.json(
      { message: "Caminho de API invalido." },
      { status: 400 },
    );
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.set("accept-encoding", "identity");

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    if (request.method === "GET" && joinedPath === "v1/site") {
      return NextResponse.json({ data: {} });
    }

    return NextResponse.json(
      { message: "Servico temporariamente indisponivel." },
      { status: 503 },
    );
  }

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
