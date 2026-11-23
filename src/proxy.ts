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

  const isAdminRoute =
    pathname === "/panel/dashboard/admin" ||
    pathname.startsWith("/panel/dashboard/admin/");

  if (pathname === "/panel/dashboard" || pathname === "/panel/dashboard/") {
    if (userRole === "admin") {
      return NextResponse.redirect(
        new URL("/panel/dashboard/admin", request.url),
      );
    }
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

  if (
    (pathname === "/panel/dashboard/buyer" ||
      pathname === "/panel/dashboard/buyer/" ||
      pathname === "/panel/dashboard/seller" ||
      pathname === "/panel/dashboard/seller/") &&
    userRole === "admin"
  ) {
    return NextResponse.redirect(
      new URL("/panel/dashboard/admin", request.url),
    );
  }

  if (isAdminRoute && userRole !== "admin") {
    const fallbackPath =
      userRole === "seller"
        ? "/panel/dashboard/seller"
        : "/panel/dashboard/buyer";

    return NextResponse.redirect(new URL(fallbackPath, request.url));
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

  const isNotificationsAdminRoute =
    pathname === "/panel/notifications/admin" ||
    pathname.startsWith("/panel/notifications/admin/");

  const isNotificationsBuyerRoute =
    pathname === "/panel/notifications/buyer" ||
    pathname.startsWith("/panel/notifications/buyer/");

  if (
    pathname === "/panel/notifications" ||
    pathname === "/panel/notifications/"
  ) {
    if (userRole === "admin") {
      return NextResponse.redirect(
        new URL("/panel/notifications/admin", request.url),
      );
    }
    if (userRole === "buyer") {
      return NextResponse.redirect(
        new URL("/panel/notifications/buyer", request.url),
      );
    }
    return NextResponse.redirect(
      new URL("/panel/dashboard/seller", request.url),
    );
  }

  if (isNotificationsAdminRoute && userRole !== "admin") {
    const targetPath =
      userRole === "buyer"
        ? "/panel/notifications/buyer"
        : "/panel/dashboard/seller";
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  if (isNotificationsBuyerRoute && userRole !== "buyer") {
    const targetPath =
      userRole === "admin"
        ? "/panel/notifications/admin"
        : "/panel/dashboard/seller";
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
