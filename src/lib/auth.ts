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
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
      mfaComplete?: boolean;
      isEmailVerified?: boolean;
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
              role: user.role,
              emailVerified: user.emailVerifiedAt ? true : false,
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
        token.role = user.role;
        token.id = user.id;
        token.emailVerified = (user as any).emailVerified ?? false;
        token.mfaComplete = user.role !== "ADMIN"; 
      }
      
      if (trigger === "update" && session?.mfaComplete !== undefined) {
        token.mfaComplete = session.mfaComplete;
      }
      if (trigger === "update" && session?.emailVerified !== undefined) {
        token.emailVerified = session.emailVerified;
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
      session.user.mfaComplete = !!token?.mfaComplete;
      session.user.isEmailVerified = !!token?.emailVerified;
      
      return session;
    },
  },
});
