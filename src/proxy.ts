import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/consultations") ||
    pathname.startsWith("/profile") ||
    pathname === "/";

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
    if (pathname === "/") {
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthPage && token) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/consultations/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
