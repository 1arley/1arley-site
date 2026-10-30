import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getRuntimeApiBaseUrl,
  isSameOriginMutation,
  isValidProxyPath,
  resolveUpstreamUrl,
} from "@/lib/admin-cookie";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

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

  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { message: "Origem nao autorizada." },
      { status: 403 },
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

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim();

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("cookie");
  headers.set("accept-encoding", "identity");

  if (sessionToken) {
    headers.set("authorization", `Bearer ${sessionToken}`);
  }

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
