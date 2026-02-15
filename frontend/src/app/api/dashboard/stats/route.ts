import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const [applicationCount, jobCount, profile] = await Promise.all([
      prisma.application.count({ where: { userId: session.user.id } }),
      prisma.job.count({ where: { isActive: true } }),
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
    ]);

    // For now, let's return some stats. We don't have a model for saved jobs yet.
    // We can use the number of skills as a proxy for profile completion.
    const skillCount = profile?.skills?.length || 0;

    return NextResponse.json({
      ok: true,
      stats: {
        applications: applicationCount,
        availableJobs: jobCount,
        skillsCount: skillCount,
        isVerified: profile?.verificationStatus === "VERIFIED",
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
