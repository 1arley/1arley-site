import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function getRuntimeApiBaseUrl(): string {
  const apiBaseUrl = process.env.API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      "API_BASE_URL nao esta definida. Configure a URL da API no ambiente de runtime.",
    );
  }

  return apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;

  let apiBaseUrl: string;
  try {
    apiBaseUrl = getRuntimeApiBaseUrl();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao resolver API_BASE_URL.";

    return NextResponse.json({ message }, { status: 500 });
  }

  const targetUrl = new URL(
    `${path.join("/")}${request.nextUrl.search}`,
    `${apiBaseUrl}/`,
  );

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    redirect: "manual",
    cache: "no-store",
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
