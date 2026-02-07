import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const verifications = await prisma.idVerification.findMany({
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
      take: 10,
    });

    return NextResponse.json({ ok: true, data: verifications });
  } catch (error) {
    console.error("Admin verifications error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
