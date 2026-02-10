import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { rateLimit } from "@/lib/rate-limit";

export async function POST() {
  try {
    const { success } = await rateLimit(3, 60000); // 3 per minute
    if (!success) {
      return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({ ok: false, message: "Email already verified" }, { status: 400 });
    }

    const verificationToken = await generateVerificationToken(user.email, "EMAIL_VERIFICATION");
    await sendVerificationEmail(user.email, verificationToken.token);

    return NextResponse.json({ ok: true, message: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ ok: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}
