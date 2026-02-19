import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-mobile";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    // Check if already saved
    const existingSave = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json({ ok: true, message: "Job already saved" }, { status: 200 });
    }

    // Save the job
    await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
    });

    return NextResponse.json({ ok: true, message: "Job saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json({ ok: false, message: "Failed to save job" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;

    // Delete the saved job
    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ ok: true, message: "Job removed from saved" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ ok: true, message: "Job not in saved list" });
    }
    console.error("Unsave job error:", error);
    return NextResponse.json({ ok: false, message: "Failed to remove saved job" }, { status: 500 });
  }
}
