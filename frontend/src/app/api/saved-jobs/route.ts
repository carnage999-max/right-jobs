import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const savedJobs = await prisma.savedJob.findMany({
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

    const jobs = savedJobs.map((saved) => saved.job);

    return NextResponse.json({ ok: true, jobs });
  } catch (error) {
    console.error("Fetch saved jobs error:", error);
    return NextResponse.json({ ok: false, message: "Failed to fetch saved jobs" }, { status: 500 });
  }
}
