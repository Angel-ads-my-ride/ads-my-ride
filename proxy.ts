import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const customerRoutes = ["/dashboard"];
const advertiserRoutes = ["/advertiser/dashboard", "/advertiser/ads"];
const authRoutes = ["/auth", "/advertiser/auth"];
const adminRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // admin.adsmyride.com → rewrite to /admin
  if (host.startsWith("admin.")) {
    const url = request.nextUrl.clone();
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = "/admin" + (url.pathname === "/" ? "" : url.pathname);
    }
    return NextResponse.rewrite(url);
  }

  const path = request.nextUrl.pathname;
  const session = request.cookies.get("session")?.value;
  const payload = await decrypt(session);

  const isCustomerRoute = customerRoutes.some((r) => path.startsWith(r));
  const isAdvertiserRoute = advertiserRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => path.startsWith(r));

  if (isCustomerRoute) {
    if (!payload || payload.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (isAdvertiserRoute) {
    if (!payload || payload.role !== "ADVERTISER") {
      return NextResponse.redirect(new URL("/advertiser/auth/login", request.url));
    }
  }

  if (isAdminRoute && !path.startsWith("/admin/login")) {
    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isAuthRoute && payload) {
    if (payload.role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (payload.role === "ADVERTISER") {
      return NextResponse.redirect(new URL("/advertiser/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
