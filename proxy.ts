import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function getMe(token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // 1. Define route categories
  const routes = {
    isAuth: pathname.startsWith("/auth"),
    isAdmin: pathname.startsWith("/admin"),
  };

  const isProtectedRoute = routes.isAdmin;

  // 2. Public routes (not /auth, not protected) → pass through immediately
  if (!routes.isAuth && !isProtectedRoute) {
    return NextResponse.next();
  }

  // 3. Protected route without token → redirect to login with callback
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Authenticated user on an /auth page → redirect to correct destination
  if (routes.isAuth && token) {
    const user = await getMe(token);
    if (user) {
      const role = user.role?.toLowerCase();
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 5. Everything else passes through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
