import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidInternalNextPath,
  isWellFormedJwt,
  sanitizeNextPath,
} from "@/lib/admin-cookie";

export function proxy(request: NextRequest): NextResponse {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const hasValidCookie = isWellFormedJwt(token);
  const { pathname, search } = request.nextUrl;

  if (pathname === "/login" || pathname.startsWith("/login/")) {
    if (hasValidCookie) {
      const destination = sanitizeNextPath(
        request.nextUrl.searchParams.get("next"),
        "/admin/site",
      );
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!hasValidCookie) {
      const candidateNext = `${pathname}${search}`;
      const loginUrl = new URL("/login", request.url);
      if (isValidInternalNextPath(candidateNext)) {
        loginUrl.searchParams.set("next", candidateNext);
      }
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};
