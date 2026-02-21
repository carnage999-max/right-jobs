import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        isDefault: "desc",
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ok: true, data: resumes });
  } catch (error) {
    console.error("Fetch resumes error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, filename } = body;

    if (!url || !filename) {
      return NextResponse.json(
        { ok: false, message: "URL and filename are required" },
        { status: 400 }
      );
    }

    // Check resume count (max 3)
    const resumeCount = await prisma.resume.count({
      where: {
        userId: session.user.id,
      },
    });

    if (resumeCount >= 3) {
      return NextResponse.json(
        { ok: false, message: "Maximum 3 resumes allowed per user" },
        { status: 400 }
      );
    }

    // If this is the first resume, make it default
    const isDefault = resumeCount === 0;

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        url,
        filename,
        isDefault,
      },
    });

    return NextResponse.json({ ok: true, data: resume });
  } catch (error) {
    console.error("Create resume error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
