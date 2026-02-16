import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { headers } from "next/headers";

const verifyMfaSchema = z.object({
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role.toUpperCase() !== "ADMIN") {
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

    const authHeader = (await headers()).get("authorization");
    const isMobile = authHeader?.startsWith("Bearer ");

    if (isMobile) {
      const newToken = Buffer.from(JSON.stringify({ 
        id: session.user.id, 
        email: session.user.email, 
        role: session.user.role,
        mfaComplete: true,
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000 
      })).toString('base64');
      return NextResponse.json({ ok: true, message: "MFA Verified", token: newToken });
    }

    return NextResponse.json({ ok: true, message: "MFA Verified" });
  } catch (error) {
    console.error("MFA Verify error:", error);
    return NextResponse.json({ ok: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}
