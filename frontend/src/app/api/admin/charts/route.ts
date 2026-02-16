import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    // Get last 7 days metrics
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const start = startOfDay(date);
      const end = endOfDay(date);

      const [appsCount, userCount] = await Promise.all([
        prisma.application.count({
          where: {
            createdAt: { gte: start, lte: end }
          }
        }),
        prisma.user.count({
          where: {
            createdAt: { gte: start, lte: end }
          }
        })
      ]);

      chartData.push({
        name: format(date, "EEE"),
        apps: appsCount,
        signups: userCount,
      });
    }

    return NextResponse.json({ ok: true, data: chartData });
  } catch (error) {
    console.error("Admin chart data error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
