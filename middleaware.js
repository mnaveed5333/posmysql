import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(req) {
  const token = req.cookies.get("pos_token")?.value;
  const { pathname } = req.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/reports");

  const isLoginPage = pathname === "/login";

  if (isAdminRoute) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (isLoginPage && token && verifyToken(token)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/orders/:path*",
    "/reports/:path*",
    "/login",
  ],
};