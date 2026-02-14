import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyLogoUrl: z.string().optional(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
  category: z.string().min(2, "Category must be at least 2 characters"),
  salaryRange: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = jobSchema.parse(body);

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
        isActive: true,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Job posted successfully", 
      job 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        message: "Validation failed", 
        errors: error.issues 
      }, { status: 400 });
    }

    console.error("Job creation error:", error);
    return NextResponse.json({ 
      ok: false, 
      message: "Something went wrong" 
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (type && type !== "all") {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ok: true, jobs });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ ok: false, message: "Failed to fetch jobs" }, { status: 500 });
  }
}
