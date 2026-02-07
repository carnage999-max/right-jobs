import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { logAdminAction } from "@/lib/audit";
import { z } from "zod";

const updateUserSchema = z.object({
  id: z.string(),
  action: z.enum(["SUSPEND", "ACTIVATE", "DELETE", "FORCE_PASSWORD_RESET"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const body = await req.json();
    const { id: targetUserId, action } = updateUserSchema.parse(body);

    if (targetUserId === session.user.id) {
        return NextResponse.json({ ok: false, message: "You cannot perform this action on yourself" }, { status: 400 });
    }

    if (action === "DELETE") {
        await prisma.user.delete({ where: { id: targetUserId } });
    } else if (action === "SUSPEND" || action === "ACTIVATE") {
        await prisma.user.update({
            where: { id: targetUserId },
            data: { isSuspended: action === "SUSPEND" }
        });
    } else if (action === "FORCE_PASSWORD_RESET") {
        const user = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (user) {
            const token = await generateVerificationToken(user.email, "PASSWORD_RESET");
            await sendPasswordResetEmail(token.email, token.token);
        }
    }

    await logAdminAction({
      actorAdminId: session.user.id,
      action: `USER_${action}`,
      entityType: "USER",
      entityId: targetUserId,
    });

    return NextResponse.json({ ok: true, message: `User ${action.toLowerCase()}d successfully` });
  } catch (error) {
    console.error("Admin user action error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
