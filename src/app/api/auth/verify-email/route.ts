export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ ok: false, message: "Missing token" }, { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken || verificationToken.type !== "EMAIL_VERIFICATION") {
      return NextResponse.json({ ok: false, message: "Invalid token" }, { status: 400 });
    }

    const hasExpired = new Date(verificationToken.expiresAt) < new Date();
    if (hasExpired) {
      return NextResponse.json({ ok: false, message: "Token has expired" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email }
    });

    if (!user) {
      return NextResponse.json({ ok: false, message: "Email does not exist" }, { status: 400 });
    }

    // If already verified, just return success
    if (user.emailVerifiedAt) {
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
      }).catch(() => {}); // Ignore if already deleted
      
      return NextResponse.json({ ok: true, message: "Email already verified" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });

    // Cleanup: delete the token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    return NextResponse.json({ ok: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ ok: false, message: "Something went wrong" }, { status: 500 });
  }
}
