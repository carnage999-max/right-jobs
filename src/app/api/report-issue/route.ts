import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendIssueReportEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // We allow anonymous reporting if session is missing, but prefer session email
    const userEmail = session?.user?.email || "Anonymous User";
    
    const { description, screenshot } = await req.json();

    if (!description) {
      return NextResponse.json({ ok: false, message: "Description is required" }, { status: 400 });
    }

    const attachments = [];
    if (screenshot) {
      // Expecting base64 string like "data:image/png;base64,iVBORw0KGgo..."
      const [header, base64Content] = screenshot.split(",");
      const extension = header.match(/\/(.*?);/)?.[1] || "png";
      
      attachments.push({
        filename: `issue-screenshot-${Date.now()}.${extension}`,
        content: base64Content,
      });
    }

    await sendIssueReportEmail(userEmail, description, attachments);

    return NextResponse.json({ ok: true, message: "Issue reported successfully" });
  } catch (error: any) {
    console.error("Report issue API error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Failed to report issue" }, { status: 500 });
  }
}
