import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // 1. Define Route Categories
  const routes = {
    isAuth: pathname.startsWith("/auth"),
    isAdmin: pathname.startsWith("/admin"),
    isComplete: pathname.startsWith("/complete"),
    isGuard: pathname.startsWith("/guard"),
  };

  const isProtectedRoute =
    routes.isAdmin || routes.isComplete || routes.isGuard;

  // Ignore public routes immediately to save execution time
  if (!routes.isAuth && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Reject missing tokens on protected routes globally
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Prevent authenticated users from flashing the Login screen
  // by sending them to the specialized Client Guard URL to determine their destination natively!
  if (token && routes.isAuth) {
    return NextResponse.rewrite(new URL("/guard", request.url));
  }

  // Pass control flawlessly to the Client React UI
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
