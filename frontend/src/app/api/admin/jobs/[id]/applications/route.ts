import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;

    const [applications, job] = await Promise.all([
      prisma.application.findMany({
        where: { jobId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
              idVerification: {
                 select: { status: true }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.job.findUnique({
        where: { id: jobId },
        select: { title: true, companyName: true }
      })
    ]);

    if (!job) {
       return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, applications, job });
  } catch (error) {
    console.error("Fetch job applications error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
