import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAdminOtp } from "@/lib/tokens";
import { sendOTPEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { success } = await rateLimit(3, 300000); // 3 attempts per 5 mins
    if (!success) {
      return NextResponse.json({ ok: false, message: "Too many attempts. Please wait." }, { status: 429 });
    }
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { otp } = await generateAdminOtp(session.user.email!);
    await sendOTPEmail(session.user.email!, otp);

    return NextResponse.json({ ok: true, message: "Code sent successfully" });
  } catch (error) {
    console.error("MFA Resend error:", error);
    return NextResponse.json({ ok: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}
