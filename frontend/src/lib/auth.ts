import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { authConfig } from "@/auth.config";

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
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6),
            captchaToken: z.string().optional()
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, captchaToken } = parsedCredentials.data;

          // 1. Verify reCAPTCHA for login
          if (process.env.NODE_ENV === "production" || process.env.RECAPTCHA_SECRET_KEY) {
            const { verifyCaptcha } = await import("./captcha");
            const isValid = await verifyCaptcha(captchaToken || "");
            if (!isValid) {
              console.warn(`[SECURITY] reCAPTCHA verification failed for login: ${email}`);
              return null;
            }
          }

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
});
