import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function logAdminAction({
  actorAdminId,
  action,
  entityType,
  entityId,
  metaJson,
}: {
  actorAdminId: string;
  action: string;
  entityType: string;
  entityId: string;
  metaJson?: any;
}) {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    await prisma.auditLog.create({
      data: {
        actorAdminId,
        action,
        entityType,
        entityId,
        ip,
        metaJson: metaJson || {},
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
    // Don't crash the main action if audit logging fails, but log it
  }
}
