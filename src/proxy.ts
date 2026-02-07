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
  ].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/jobs/");

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAppRoute = nextUrl.pathname.startsWith("/app");
  const isMfaRoute = nextUrl.pathname === "/auth/mfa";

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn && !isMfaRoute) {
      // If logged in as admin and need MFA, let them go to MFA
      if (req.auth?.user.role === "ADMIN" && !req.auth?.user.mfaComplete) {
         return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/app", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
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

     // Redirect admin away from standard app to admin if they are verified? 
     // Or just let them be? Usually admins can use the app too.
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
