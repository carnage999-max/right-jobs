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

    const [verifications, total] = await Promise.all([
      prisma.idVerification.findMany({
        where: {
          status: "PENDING",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            }
          }
        },
        orderBy: {
          createdAt: "asc",
        },
        take: limit,
        skip: skip,
      }),
      prisma.idVerification.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({ 
      ok: true, 
      data: verifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Admin verifications error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
