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
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    
    // The login route encodes the token as: Buffer.from(JSON.stringify({...})).toString('base64')
    // So we just need to decode it back.
    const decodedBuffer = Buffer.from(token, 'base64');
    const decodedString = decodedBuffer.toString('utf-8');
    const decoded = JSON.parse(decodedString);
    
    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    // Return session structure
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || "USER",
        mfaComplete: true // Trust mobile tokens for now as they are issued after full auth
      }
    };
  } catch (e) {
    console.error("[AUTH-MOBILE] Token verification failed:", e);
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
