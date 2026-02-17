import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { z } from "zod";

const reviewActionSchema = z.object({
  id: z.string(),
  action: z.enum(["APPROVE", "REJECT", "DELETE"]),
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const body = await req.json();
    const { id: reviewId, action } = reviewActionSchema.parse(body);

    if (action === "DELETE") {
      await prisma.review.delete({ where: { id: reviewId } });
    } else {
      const status = action === "APPROVE" ? "VERIFIED" : "REJECTED";
      await prisma.review.update({
        where: { id: reviewId },
        data: { status }
      });
    }

    await logAdminAction({
      actorAdminId: session.user.id,
      action: `REVIEW_${action}`,
      entityType: "REVIEW",
      entityId: reviewId,
    });

    return NextResponse.json({ ok: true, message: `Review ${action.toLowerCase()}d successfully` });
  } catch (error) {
    console.error("Admin review action error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
