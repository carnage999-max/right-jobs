import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/mail";
import { logAdminAction } from "@/lib/audit";
import { z } from "zod";

const broadcastSchema = z.object({
  subject: z.string().min(5),
  content: z.string().min(10),
  target: z.enum(["ALL", "JOB_SEEKERS", "ADMINS"]),
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
    const { subject, content, target } = broadcastSchema.parse(body);

    // Fetch targets
    let targetUsers;
    if (target === "ALL") {
      targetUsers = await prisma.user.findMany({ select: { email: true } });
    } else if (target === "ADMINS") {
      targetUsers = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { email: true } });
    } else {
      targetUsers = await prisma.user.findMany({ where: { role: "USER" }, select: { email: true } });
    }

    const emails = targetUsers.map(u => u.email);
    const FROM_EMAIL = process.env.EMAIL_FROM || '"Right Jobs" <info@rightjob.net>';

    if (emails.length > 0) {
      const BATCH_SIZE = 50;
      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE);
        const { error: resendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: batch,
          subject: subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
              <h1 style="color: #014D9F; font-size: 24px; font-weight: 900; margin-bottom: 20px;">System Notification</h1>
              <div style="color: #333; line-height: 1.6; font-size: 16px;">
                ${content.replace(/\n/g, '<br>')}
              </div>
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Best regards,<br>
                The Right Jobs Team
              </p>
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
              <p style="color: #999; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                This is an official administrative broadcast from Right Jobs.
              </p>
            </div>
          `,
        });

        if (resendError) {
          throw new Error(`Resend error: ${resendError.message}`);
        }
      }
    }

    await logAdminAction({
      actorAdminId: session.user.id,
      action: `BROADCAST_${target}`,
      entityType: "SYSTEM",
      entityId: "BROADCAST",
    });

    return NextResponse.json({ ok: true, message: `Broadcast sent to ${emails.length} users` });
  } catch (error: any) {
    console.error("Admin broadcast error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        message: "Validation failed", 
        issues: error.issues 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      ok: false, 
      message: error.message || "Internal server error" 
    }, { status: 500 });
  }
}
