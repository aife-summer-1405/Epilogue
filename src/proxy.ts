import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // 1. Auth Check
  if (!userId) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("auth_error", "login-required", {
      maxAge: 10,
      path: "/",
    });
    return response;
  }

  // 2. Dashboard Routing
  if (pathname === "/panel/dashboard" || pathname === "/panel/dashboard/") {
    if (userRole === "buyer") {
      return NextResponse.redirect(
        new URL("/panel/dashboard/buyer", request.url),
      );
    }
    if (userRole === "seller") {
      return NextResponse.redirect(
        new URL("/panel/dashboard/seller", request.url),
      );
    }
  }

  // 3. Role Protection for specific dashboard pages
  if (
    (pathname === "/panel/dashboard/buyer" ||
      pathname === "/panel/dashboard/buyer/") &&
    userRole === "seller"
  ) {
    return NextResponse.redirect(
      new URL("/panel/dashboard/seller", request.url),
    );
  }

  if (
    (pathname === "/panel/dashboard/seller" ||
      pathname === "/panel/dashboard/seller/") &&
    userRole === "buyer"
  ) {
    return NextResponse.redirect(
      new URL("/panel/dashboard/buyer", request.url),
    );
  }

  // 4. House Management Access (Catches /panel/houseManagement, /add-house, /36, etc.)
  if (pathname.startsWith("/panel/houseManagement")) {
    if (userRole === "buyer") {
      const dashboardUrl = new URL("/panel/dashboard/buyer", request.url);
      const response = NextResponse.redirect(dashboardUrl);

      response.cookies.set("auth_error", "access_denied", {
        maxAge: 10,
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // This single matcher is enough to cover all routes under /panel
  matcher: ["/panel/:path*"],
};
