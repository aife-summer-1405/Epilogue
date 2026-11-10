import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;
  const userRole = request.cookies.get("userRole")?.value;

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

  if (
    pathname === "/panel/dashboard/buyer" ||
    pathname === "/panel/dashboard/buyer/"
  ) {
    if (userRole === "seller") {
      return NextResponse.redirect(
        new URL("/panel/dashboard/seller", request.url),
      );
    }
  }

  if (
    pathname === "/panel/dashboard/seller" ||
    pathname === "/panel/dashboard/seller/"
  ) {
    if (userRole === "buyer") {
      return NextResponse.redirect(
        new URL("/panel/dashboard/buyer", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/panel/dashboard/:path*"],
};
