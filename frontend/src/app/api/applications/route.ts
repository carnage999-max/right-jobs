import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { z } from "zod";

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
  selectedResumeUrl: z.string().url().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ok: true, data: applications });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, coverLetter, selectedResumeUrl } = applicationSchema.parse(body);

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        jobId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { ok: false, message: "You have already applied for this job" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId,
        coverLetter: coverLetter || null,
      },
      include: {
        job: true,
      },
    });

    // Delete draft after successful application
    await prisma.applicationDraft.deleteMany({
      where: {
        userId: session.user.id,
        jobId,
      },
    });

    return NextResponse.json({ ok: true, data: application });
  } catch (error) {
    console.error("Create application error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
