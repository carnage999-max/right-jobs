import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.emailVerified = (user as any).emailVerified ?? false;
        token.mfaComplete = (user as any).role !== "ADMIN"; 
        token.sessionVersion = (user as any).sessionVersion ?? 0;
        token.picture = user.image;
      }
      
      if (trigger === "update") {
        if (session?.mfaComplete !== undefined) token.mfaComplete = session.mfaComplete;
        if (session?.emailVerified !== undefined) token.emailVerified = session.emailVerified;
        if (session?.image !== undefined) token.picture = session.image;
        if (session?.name !== undefined) token.name = session.name;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as UserRole;
      }
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.picture) {
        session.user.image = token.picture as string;
      }
      if (token?.name) {
        session.user.name = token.name as string;
      }
      session.user.mfaComplete = !!token?.mfaComplete;
      session.user.isEmailVerified = !!token?.emailVerified;
      session.user.sessionVersion = (token as any).sessionVersion as number;
      
      return session;
    },
  },
  providers: [], // Providers are added in lib/auth.ts to avoid bundling DB drivers in middleware
} satisfies NextAuthConfig;
