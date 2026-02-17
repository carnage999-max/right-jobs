import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { z } from "zod";

const updateJobSchema = z.object({
  id: z.string(),
  action: z.enum(["TOGGLE_ACTIVE", "DELETE"]),
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const body = await req.json();
    const { id: jobId, action } = updateJobSchema.parse(body);

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    if (action === "DELETE") {
        await prisma.job.delete({ where: { id: jobId } });
    } else if (action === "TOGGLE_ACTIVE") {
        await prisma.job.update({
            where: { id: jobId },
            data: { isActive: !job.isActive }
        });
    }

    await logAdminAction({
      actorAdminId: session.user.id,
      action: `JOB_${action}`,
      entityType: "JOB",
      entityId: jobId,
      metaJson: { jobTitle: job.title }
    });

    return NextResponse.json({ ok: true, message: `Job updated successfully` });
  } catch (error) {
    console.error("Admin job action error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
