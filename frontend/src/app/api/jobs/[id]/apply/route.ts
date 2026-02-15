import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendApplicationConfirmationEmail } from "@/lib/mail";
import { z } from "zod";

const applySchema = z.object({
  coverLetter: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: jobId } = await params;

    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { coverLetter } = applySchema.parse(body);

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId, isActive: true },
    });

    if (!job) {
      return NextResponse.json({ ok: false, message: "Job not found or inactive" }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json({ ok: false, message: "You have already applied for this job" }, { status: 400 });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        coverLetter,
        status: "PENDING", // Initial status
      },
    });

    // Send email notification to user
    if (session.user.email) {
      await sendApplicationConfirmationEmail(session.user.email, job.title);
    }

    return NextResponse.json({ ok: true, data: application });
  } catch (error) {
    console.error("Application error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
