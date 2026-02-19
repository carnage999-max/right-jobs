import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { z } from "zod";

const draftSchema = z.object({
  coverLetter: z.string().optional(),
  selectedResumeUrl: z.string().url().optional().nullable(),
});

// GET - Fetch draft for a job
export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const draft = await prisma.applicationDraft.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ ok: true, data: draft });
  } catch (error) {
    console.error("Fetch draft error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Save or update draft
export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { coverLetter, selectedResumeUrl } = draftSchema.parse(body);

    const draft = await prisma.applicationDraft.upsert({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
      update: {
        coverLetter: coverLetter || null,
        selectedResumeUrl: selectedResumeUrl || null,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        jobId,
        coverLetter: coverLetter || null,
        selectedResumeUrl: selectedResumeUrl || null,
      },
    });

    return NextResponse.json({ ok: true, data: draft });
  } catch (error) {
    console.error("Save draft error:", error);
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

// DELETE - Delete draft
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.applicationDraft.delete({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ ok: true, message: "Draft deleted" });
  } catch (error) {
    console.error("Delete draft error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
