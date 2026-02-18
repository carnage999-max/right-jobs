import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerifiedAt: true,
          createdAt: true,
          isSuspended: true,
          avatarUrl: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: skip,
      }),
      prisma.user.count(),
    ]);

    // Generate signed URLs for avatars
    const { getSignedDownloadUrl } = await import("@/lib/s3");
    const usersWithSignedUrls = await Promise.all(users.map(async (user) => {
      if (user.avatarUrl) {
        const key = user.avatarUrl.split(".com/")[1];
        if (key) {
          return { ...user, avatarUrl: await getSignedDownloadUrl(key) };
        }
      }
      return user;
    }));

    return NextResponse.json({ 
      ok: true, 
      data: usersWithSignedUrls,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Admin list users error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
