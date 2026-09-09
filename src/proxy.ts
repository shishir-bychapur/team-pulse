import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./utils/session";

const protectedRoutes = ["/", "/actions", "/updates"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check protected routes
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    path.startsWith("/actions/") ||
    path.startsWith("/updates/");

  // Check public routes
  const isPublicRoute =
    path === "/login" || path === "/members" || path.startsWith("/members/");

  // Get session cookie from request
  const cookie = req.cookies.get("session")?.value;

  // Decrypt session
  const session = cookie ? await decrypt(cookie) : null;

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from login
  if (isPublicRoute && session?.id && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
