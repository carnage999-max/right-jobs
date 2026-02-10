import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
            idVerification: {
              select: {
                status: true
              }
            }
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
