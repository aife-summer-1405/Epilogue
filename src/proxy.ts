import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;

  if (!userId) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    const response = NextResponse.redirect(loginUrl);

    response.cookies.set("auth_error", "login-required", {
      maxAge: 10,
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
