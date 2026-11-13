import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  if (!userRole) {
    const loginUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(loginUrl);

    response.cookies.delete("userRole");
    response.cookies.delete("userId");
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    response.cookies.set("auth_error", "login-required", {
      maxAge: 10,
      path: "/",
    });
    return response;
  }

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

  if (
    pathname === "/panel/reserveManagement" ||
    pathname === "/panel/reserveManagement/"
  ) {
    if (userRole === "buyer") {
      return NextResponse.redirect(
        new URL("/panel/reserveManagement/buyer", request.url),
      );
    }
    if (userRole === "seller") {
      return NextResponse.redirect(
        new URL("/panel/reserveManagement/seller", request.url),
      );
    }
  }

  if (
    (pathname === "/panel/reserveManagement/buyer" ||
      pathname === "/panel/reserveManagement/buyer/") &&
    userRole === "seller"
  ) {
    return NextResponse.redirect(
      new URL("/panel/reserveManagement/seller", request.url),
    );
  }

  if (
    (pathname === "/panel/reserveManagement/seller" ||
      pathname === "/panel/reserveManagement/seller/") &&
    userRole === "buyer"
  ) {
    return NextResponse.redirect(
      new URL("/panel/reserveManagement/buyer", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
