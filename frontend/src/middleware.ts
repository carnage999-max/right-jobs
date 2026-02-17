import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = [
    "/",
    "/about",
    "/pricing",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
    "/cookies",
    "/security",
    "/trust-safety",
    "/jobs",
    "/auth/login",
    "/auth/signup",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ].includes(nextUrl.pathname) || (nextUrl.pathname.startsWith("/jobs/") && nextUrl.pathname !== "/jobs/post");

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAppRoute = nextUrl.pathname.startsWith("/app");
  const isMfaRoute = nextUrl.pathname === "/auth/mfa";

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (nextUrl.pathname === "/auth/login" || nextUrl.pathname === "/auth/signup") {
        const dashboardUrl = req.auth?.user.role === "ADMIN" ? "/admin" : "/app";
        return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
      }

      if (isMfaRoute) {
        if (req.auth?.user.role === "ADMIN" && !req.auth?.user.mfaComplete) {
          return NextResponse.next();
        }
        const dashboardUrl = req.auth?.user.role === "ADMIN" ? "/admin" : "/app";
        return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn) {
     const role = req.auth?.user.role;
     const mfaComplete = req.auth?.user.mfaComplete;

     if (isAdminRoute) {
        if (role !== "ADMIN") {
           return NextResponse.redirect(new URL("/app", nextUrl));
        }
        if (!mfaComplete) {
           return NextResponse.redirect(new URL("/auth/mfa", nextUrl));
        }
     }

     if (isAppRoute && role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", nextUrl));
     }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
