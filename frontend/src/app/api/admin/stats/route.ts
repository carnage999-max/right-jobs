import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const [totalUsers, totalJobs, pendingVerifications, totalApps] = await Promise.all([
      prisma.user.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.idVerification.count({ where: { status: "PENDING" } }),
      prisma.application.count(),
    ]);

    // Mocking some trend data for now, in a real app you'd compare current vs last period
    return NextResponse.json({
      ok: true,
      data: {
        totalUsers: { value: totalUsers, change: "+3.2%", trend: "up" },
        activeJobs: { value: totalJobs, change: "+5.1%", trend: "up" },
        pendingVerifications: { value: pendingVerifications, change: "-12%", trend: "down" },
        totalApplications: { value: totalApps, change: "+8.4%", trend: "up" },
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
