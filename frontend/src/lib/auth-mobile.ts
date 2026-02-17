import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface MobileSession {
  user: {
    id: string;
    email: string;
    role: string;
    mfaComplete?: boolean;
  };
}

export async function getMobileSession(): Promise<MobileSession | null> {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    // Basic base64 decoding with URL-safe support
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString());
    
    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || "USER", 
        mfaComplete: !!decoded.mfaComplete,
      }
    };
  } catch (e) {
    return null;
  }
}

export interface AppSession {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    mfaComplete?: boolean;
  };
}

export async function getAuthSession(): Promise<AppSession | null> {
  // 1. Try NextAuth session (web)
  const session = await auth();
  if (session) {
    return {
      user: {
        id: session.user.id,
        email: session.user.email || "",
        role: session.user.role,
        name: session.user.name || null,
        mfaComplete: true, // Website admins are trusted by default
      }
    };
  }

  // 2. Try Mobile token
  const mobileSession = await getMobileSession();
  if (mobileSession) {
    // Enrich with actual DB data to be safe
    const user = await prisma.user.findUnique({
      where: { email: mobileSession.user.email }
    });
    
    return {
      user: {
        id: user?.id || mobileSession.user.id,
        email: user?.email || mobileSession.user.email,
        role: user?.role || mobileSession.user.role,
        name: user?.name || null,
        mfaComplete: mobileSession.user.mfaComplete,
      }
    };
  }

  return null;
}
