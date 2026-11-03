// proxy.ts (project root, or src/ if you use a src folder)
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // So the user comes back to the page they wanted after logging in.
    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create-event",
    "/joined-events/:path*",
    "/manage-events/:path*", // guess: change to your real route
    "/profile/:path*", // guess: change to your real route
  ],
};
