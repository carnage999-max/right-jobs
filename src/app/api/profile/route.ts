import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url().optional(),
  resumeFilename: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      }
    });

    if (!profile) {
      // Create a default profile if it doesn't exist
      const newProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          verificationStatus: "PENDING", // Default
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            }
          }
        }
      });
      return NextResponse.json({ ok: true, data: newProfile });
    }

    return NextResponse.json({ ok: true, data: profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileSchema.parse(body);

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        bio: validatedData.bio,
        location: validatedData.location,
        skills: validatedData.skills,
        resumeUrl: validatedData.resumeUrl,
        resumeFilename: validatedData.resumeFilename,
      }
    });

    // Update user name as well if provided
    if (validatedData.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: validatedData.name }
      });
    }

    return NextResponse.json({ ok: true, data: updatedProfile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
