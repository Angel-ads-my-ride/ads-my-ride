import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host.startsWith("admin.")) {
    const url = request.nextUrl.clone();
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = "/admin" + (url.pathname === "/" ? "" : url.pathname);
    }
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
