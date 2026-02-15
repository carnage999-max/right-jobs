import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            avatarUrl: true,
            email: true,
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, job });
  } catch (error) {
    console.error("Fetch job detail error:", error);
    return NextResponse.json({ ok: false, message: "Failed to fetch job details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: body.title,
        companyName: body.companyName,
        location: body.location,
        type: body.type,
        category: body.category,
        salaryRange: body.salaryRange,
        description: body.description,
        isActive: body.isActive,
      }
    });

    await logAdminAction({
      actorAdminId: session.user.id,
      action: "JOB_EDIT",
      entityType: "JOB",
      entityId: id,
      metaJson: body,
    });

    return NextResponse.json({ ok: true, data: updatedJob });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ ok: false, message: "Failed to update job" }, { status: 500 });
  }
}
