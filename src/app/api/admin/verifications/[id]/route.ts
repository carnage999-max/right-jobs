import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: verificationId } = await params;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const verification = await prisma.idVerification.findUnique({
      where: { id: verificationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
          }
        }
      }
    });

    if (!verification) {
      return NextResponse.json({ ok: false, message: "Verification not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: verification });
  } catch (error) {
    console.error("Fetch verification error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
