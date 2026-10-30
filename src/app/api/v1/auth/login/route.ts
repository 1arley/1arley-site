import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  deriveMaxAgeFromJwt,
  getAdminCookieOptions,
  getRuntimeApiBaseUrl,
  isSameOriginMutation,
  resolveUpstreamUrl,
} from "@/lib/admin-cookie";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { message: "Origem nao autorizada." },
      { status: 403 },
    );
  }

  let apiBaseUrl: string;
  try {
    apiBaseUrl = getRuntimeApiBaseUrl();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao resolver API_BASE_URL.";
    return NextResponse.json({ message }, { status: 503 });
  }

  const targetUrl = resolveUpstreamUrl(
    apiBaseUrl,
    ["v1", "auth", "login"],
    "",
    request.nextUrl.pathname,
  );

  if (!targetUrl) {
    return NextResponse.json(
      { message: "Caminho de API invalido." },
      { status: 400 },
    );
  }

  let bodyBuffer: ArrayBuffer;
  try {
    bodyBuffer = await request.arrayBuffer();
  } catch {
    return NextResponse.json(
      { message: "Corpo de requisicao invalido." },
      { status: 400 },
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "accept-encoding": "identity",
        "content-type":
          request.headers.get("content-type") || "application/json",
      },
      body: bodyBuffer,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Servico temporariamente indisponivel." },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown> | null = null;
  try {
    const parsed: unknown = await upstreamResponse.json();
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      payload = parsed as Record<string, unknown>;
    }
  } catch {
    payload = null;
  }

  if (!upstreamResponse.ok) {
    const safeMessage =
      typeof payload?.message === "string" && payload.message.trim().length > 0
        ? payload.message.trim()
        : "Falha ao autenticar.";
    return NextResponse.json(
      { message: safeMessage },
      { status: upstreamResponse.status },
    );
  }

  const accessToken =
    typeof payload?.access_token === "string" ? payload.access_token.trim() : "";
  const user =
    typeof payload?.user === "object" &&
    payload.user !== null &&
    !Array.isArray(payload.user)
      ? payload.user
      : null;

  if (!accessToken || !user) {
    return NextResponse.json(
      { message: "Resposta de autenticacao invalida." },
      { status: 502 },
    );
  }

  const maxAge = deriveMaxAgeFromJwt(accessToken);
  const response = NextResponse.json({ user }, { status: 200 });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    accessToken,
    getAdminCookieOptions(maxAge),
  );

  return response;
}
