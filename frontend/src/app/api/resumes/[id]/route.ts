import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json(
        { ok: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    // If deleting default resume, set another as default
    if (resume.isDefault) {
      const nextResume = await prisma.resume.findFirst({
        where: {
          userId: session.user.id,
          id: { not: id },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (nextResume) {
        await prisma.resume.update({
          where: { id: nextResume.id },
          data: { isDefault: true },
        });
      }
    }

    // Delete the resume
    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, message: "Resume deleted" });
  } catch (error) {
    console.error("Delete resume error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { isDefault } = body;

    // Verify ownership
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json(
        { ok: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.resume.updateMany({
        where: {
          userId: session.user.id,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: { isDefault },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("Update resume error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
