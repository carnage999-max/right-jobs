import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-mobile";
import prisma from "@/lib/prisma";
import { getSignedDownloadUrl } from "@/lib/s3";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { resumeUrl: true }
    });

    if (!profile || !profile.resumeUrl) {
      return NextResponse.json({ ok: false, message: "Resume not found" }, { status: 404 });
    }

    // Extract key from public URL
    // Public URL format: https://bucket.s3.region.amazonaws.com/resumes/userId/uuid.pdf
    const urlParts = profile.resumeUrl.split(".com/");
    const key = urlParts[1];

    if (!key) {
      return NextResponse.json({ ok: false, message: "Invalid resume URL" }, { status: 400 });
    }

    const signedUrl = await getSignedDownloadUrl(key);

    return NextResponse.json({ ok: true, url: signedUrl });
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
