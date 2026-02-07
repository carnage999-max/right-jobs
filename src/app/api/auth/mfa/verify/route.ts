import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const verifyMfaSchema = z.object({
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = verifyMfaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ ok: false, message: "Invalid OTP format" }, { status: 400 });
    }

    const { otp } = result.data;

    const adminOtp = await prisma.adminOtp.findUnique({
      where: { email: session.user.email! }
    });

    if (!adminOtp || adminOtp.otp !== otp) {
      return NextResponse.json({ ok: false, message: "Invalid verification code" }, { status: 400 });
    }

    const hasExpired = new Date(adminOtp.expiresAt) < new Date();
    if (hasExpired) {
      return NextResponse.json({ ok: false, message: "Code has expired" }, { status: 400 });
    }

    // OTP is valid!
    // Delete OTP after enrichment
    await prisma.adminOtp.delete({
      where: { email: session.user.email! }
    });

    return NextResponse.json({ ok: true, message: "MFA Verified" });
  } catch (error) {
    console.error("MFA Verify error:", error);
    return NextResponse.json({ ok: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}
