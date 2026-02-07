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

    const logs = await prisma.auditLog.findMany({
      include: {
        actorAdmin: {
          select: {
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ ok: true, data: logs });
  } catch (error) {
    console.error("Admin audit logs error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
