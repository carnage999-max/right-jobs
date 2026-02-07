import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const verifyIdSchema = z.object({
  docFrontUrl: z.string().url(),
  docBackUrl: z.string().url().optional(),
  selfieUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { docFrontUrl, docBackUrl, selfieUrl } = verifyIdSchema.parse(body);

    // Create or update ID verification record
    const idVerification = await prisma.idVerification.upsert({
      where: { userId: session.user.id },
      update: {
        docFrontUrl,
        docBackUrl,
        selfieUrl,
        status: "PENDING",
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        docFrontUrl,
        docBackUrl,
        selfieUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, data: idVerification });
  } catch (error) {
    console.error("ID Verification error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
