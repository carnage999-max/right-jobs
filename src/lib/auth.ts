import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    emailVerified?: boolean;
    sessionVersion?: number;
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
      mfaComplete?: boolean;
      isEmailVerified?: boolean;
      sessionVersion?: number;
    } & DefaultSession["user"];
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.avatarUrl,
              role: user.role,
              emailVerified: user.emailVerifiedAt ? true : false,
              sessionVersion: (user as any).sessionVersion,
            };
          }
        }

        return null;
      },
    }),
  ],
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

      /* Security check: verify session version if not just signed in
      if (!user && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { sessionVersion: true }
          });

          if (!dbUser || (dbUser as any).sessionVersion !== token.sessionVersion) {
            // Invalidate the session
            return null;
          }
        } catch (error) {
          console.error("JWT security check failed:", error);
          // Don't kill the session on transient DB errors, or do? 
          // For now let's be lenient while debugging.
        }
      } */
      
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as UserRole;
      }
      if (token?.id) {
        session.user.id = token.id as string;
      }
      session.user.mfaComplete = !!token?.mfaComplete;
      session.user.isEmailVerified = !!token?.emailVerified;
      session.user.sessionVersion = (token as any).sessionVersion as number;
      
      return session;
    },
  },
});
