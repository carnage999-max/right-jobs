import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
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
  const isVerifyEmailRoute = nextUrl.pathname === "/auth/verify-email";
  const isResetPasswordRoute = nextUrl.pathname.startsWith("/auth/reset-password");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // If it's a login or signup page, redirect to app
      if (nextUrl.pathname === "/auth/login" || nextUrl.pathname === "/auth/signup") {
        const dashboardUrl = req.auth?.user.role === "ADMIN" ? "/admin" : "/app";
        return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
      }

      // If it's MFA route, let them through if they need it
      if (isMfaRoute) {
        if (req.auth?.user.role === "ADMIN" && !req.auth?.user.mfaComplete) {
          return NextResponse.next();
        }
        const dashboardUrl = req.auth?.user.role === "ADMIN" ? "/admin" : "/app";
        return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
      }

      // Allow verify-email and reset-password even when logged in? 
      // verify-email: definitely yes (user might verify while logged in)
      // reset-password: usually yes (user might click link from email)
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

     // Admin access control
     if (isAdminRoute) {
        if (role !== "ADMIN") {
           return NextResponse.redirect(new URL("/app", nextUrl));
        }
        if (!mfaComplete) {
           return NextResponse.redirect(new URL("/auth/mfa", nextUrl));
        }
     }

     // Redirect admin away from standard app to admin portal
     if (isAppRoute && role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", nextUrl));
     }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
