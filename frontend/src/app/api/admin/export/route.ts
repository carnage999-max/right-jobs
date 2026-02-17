import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-mobile";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "users";

  try {
    let data: string[] = [];
    let headers = "";

    if (type === "users") {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true }
      });
      headers = "ID,Email,Name,Role,CreatedAt\n";
      data = users.map((u) => 
        `${u.id},${u.email},"${u.name || ""}",${u.role},${u.createdAt.toISOString()}`
      );
    } else if (type === "jobs") {
      const jobs = await prisma.job.findMany();
      headers = "ID,Title,Company,Location,Type,CreatedAt\n";
      data = jobs.map((j) => 
        `${j.id},"${j.title}","${j.companyName}","${j.location || ""}",${j.type},${j.createdAt.toISOString()}`
      );
    } else if (type === "applications") {
      const apps = await prisma.application.findMany({
        include: { job: true, user: true }
      });
      headers = "ApplicationID,JobTitle,ApplicantEmail,Status,AppliedDate\n";
      data = apps.map(a => `${a.id},"${a.job.title}",${a.user.email},${a.status},${a.createdAt.toISOString()}`);
    } else if (type === "reviews") {
      const reviews = await prisma.review.findMany({
        include: { reviewer: true, targetUser: true }
      });
      headers = "ReviewID,Reviewer,Target,Rating,Status,CreatedAt\n";
      data = reviews.map((r) => 
        `${r.id},"${r.reviewer.email}","${r.targetUser.email}",${r.rating},${r.status},${r.createdAt.toISOString()}`
      );
    } else if (type === "verifications") {
      const verifs = await prisma.idVerification.findMany({ include: { user: true } });
      headers = "VerifID,UserEmail,Status,Date\n";
      data = verifs.map(v => `${v.id},${v.user.email},${v.status},${v.createdAt.toISOString()}`);
    } else if (type === "payments") {
      const payments = await prisma.payment.findMany({ include: { user: true } });
      headers = "PaymentID,UserEmail,Amount,Currency,Status,Date\n";
      data = payments.map(p => `${p.id},${p.user.email},${p.amount},${p.currency},${p.status},${p.createdAt.toISOString()}`);
    } else {
      return NextResponse.json({ ok: false, message: "Invalid export type" }, { status: 400 });
    }

    const csv = headers + data.join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="right-jobs-${type}-${new Date().toISOString()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ ok: false, message: "Failed to export CSV" }, { status: 500 });
  }
}
