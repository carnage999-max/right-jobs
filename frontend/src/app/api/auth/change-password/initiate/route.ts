import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendPasswordChangeVerificationEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST() {
  try {
    const { success } = await rateLimit(3, 60000); 
    if (!success) {
      return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });
    }
    const session = await auth();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const verificationToken = await generateVerificationToken(
        session.user.email,
        "PASSWORD_CHANGE"
    );

    await sendPasswordChangeVerificationEmail(
        verificationToken.email,
        verificationToken.token
    );

    return NextResponse.json({ ok: true, message: "Confirmation email sent" });
  } catch (error) {
    console.error("Initiate password change error:", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
