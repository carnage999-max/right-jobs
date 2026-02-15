import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { sendUserProfileUpdatedEmail } from "@/lib/mail";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2),
  role: z.enum(["USER", "ADMIN", "EMPLOYER"]),
});

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
    const { name, role } = updateUserSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, role: role as any },
    });

    // Send notification email
    try {
      await sendUserProfileUpdatedEmail(updatedUser.email, updatedUser.name || "User", updatedUser.role);
    } catch (emailError) {
      console.error("Failed to send profile update email:", emailError);
      // Don't fail the whole request if email fails
    }

    await logAdminAction({
      actorAdminId: session.user.id,
      action: "USER_PROFILE_EDIT",
      entityType: "USER",
      entityId: id,
      metaJson: { name, role },
    });

    return NextResponse.json({ ok: true, data: updatedUser });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ ok: false, message: "Failed to update user" }, { status: 500 });
  }
}
