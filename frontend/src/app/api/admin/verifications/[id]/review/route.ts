import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { sendVerificationStatusEmail } from "@/lib/mail";
import { z } from "zod";

const reviewSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  adminNotes: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    const { id: verificationId } = await params;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.mfaComplete) {
      return NextResponse.json({ ok: false, message: "MFA required" }, { status: 403 });
    }

    const body = await req.json();
    const { status, adminNotes } = reviewSchema.parse(body);

    const verification = await prisma.idVerification.findUnique({
      where: { id: verificationId },
      include: { user: true }
    });

    if (!verification) {
      return NextResponse.json({ ok: false, message: "Verification record not found" }, { status: 404 });
    }

    // Update the verification record
    await prisma.idVerification.update({
      where: { id: verificationId },
      data: {
        status,
        adminNotes,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      }
    });

    // If approved, update the user's profile status as well if needed
    // In our schema, Profile has a verificationStatus too.
    if (status === "VERIFIED") {
        await prisma.profile.update({
            where: { userId: verification.userId },
            data: { verificationStatus: "VERIFIED" }
        });
    }

    // Send status email
    await sendVerificationStatusEmail(verification.user.email, status, adminNotes || undefined);

    // Log the action
    await logAdminAction({
      actorAdminId: session.user.id,
      action: status === "VERIFIED" ? "VERIFY_ID_APPROVED" : "VERIFY_ID_REJECTED",
      entityType: "ID_VERIFICATION",
      entityId: verificationId,
      metaJson: { userId: verification.userId, notes: adminNotes }
    });

    return NextResponse.json({ ok: true, message: `Verification ${status.toLowerCase()}` });
  } catch (error) {
    console.error("Verification review error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
