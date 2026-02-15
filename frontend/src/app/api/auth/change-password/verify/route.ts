import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getVerificationTokenByToken } from "@/lib/tokens";
import { sendPasswordChangedNoticeEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { z } from "zod";

const verifySchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = verifySchema.parse(body);

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken || existingToken.type !== "PASSWORD_CHANGE") {
      return NextResponse.json({ ok: false, message: "Invalid token" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();
    if (hasExpired) {
      return NextResponse.json({ ok: false, message: "Token has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { passwordHash: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });

    await sendPasswordChangedNoticeEmail(existingToken.email);

    return NextResponse.json({ ok: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Verify password change error:", error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ ok: false, message: "Password must be at least 8 characters" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
