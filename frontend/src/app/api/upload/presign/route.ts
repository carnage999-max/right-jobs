import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedPostUrl } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType, folder = "uploads" } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ ok: false, message: "Missing filename or contentType" }, { status: 400 });
    }

    // Validate folder to prevent path traversal or unstructured uploads
    const allowedFolders = ["avatars", "resumes", "identity-docs", "uploads"];
    const targetFolder = allowedFolders.includes(folder) ? folder : "uploads";

    const fileExtension = filename.split(".").pop();
    const key = `${targetFolder}/${session.user.id}/${uuidv4()}.${fileExtension}`;

    const presignedUrl = await getPresignedPostUrl(key, contentType);
    
    // The public URL where the file will be accessible after upload
    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ ok: true, url: presignedUrl, publicUrl, key });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
