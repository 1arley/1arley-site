import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCookieOptions,
  isSameOriginMutation,
} from "@/lib/admin-cookie";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { message: "Origem nao autorizada." },
      { status: 403 },
    );
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    getAdminCookieOptions(0),
  );
  return response;
}
