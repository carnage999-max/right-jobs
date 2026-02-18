import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { rateLimit } from "@/lib/rate-limit";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  website: z.string().optional(), // Honeypot field
});

export async function POST(req: Request) {
  try {
    const { success, count } = await rateLimit(5, 60000); // 5 attempts per minute
    if (!success) {
      console.warn(`[SECURITY] Signup rate limit hit. Count: ${count}`);
      return NextResponse.json({ ok: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { captchaToken } = body;

    // 1. Verify reCAPTCHA
    if (process.env.NODE_ENV === "production" || process.env.RECAPTCHA_SECRET_KEY) {
      const { verifyCaptcha } = await import("@/lib/captcha");
      const isValid = await verifyCaptcha(captchaToken);
      if (!isValid) {
        console.warn("[SECURITY] reCAPTCHA verification failed for signup.");
        return NextResponse.json({ ok: false, message: "Security verification failed. Please try again." }, { status: 400 });
      }
    }

    // 2. Honeypot check (Bots fill all fields)
    if (body.website) {
      console.warn(`[SECURITY] Honeypot triggered by signup request.`);
      return NextResponse.json({ ok: true, message: "Account created!" }); // Return fake success to confuse bot
    }

    const result = signupSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        ok: false, 
        message: "Validation failed", 
        fieldErrors: result.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, email, password } = result.data;

    // 2. Gibberish name detection (Suspicious bot names)
    // Heuristic: Names > 12 chars with no spaces that look like random alphanumeric strings
    const looksLikeGibberish = name.length > 12 && !name.includes(" ") && /^[a-zA-Z0-9]+$/.test(name);
    if (looksLikeGibberish) {
      console.warn(`[SECURITY] Gibberish name detected: ${name}`);
      // Return fake success to bot
      return NextResponse.json({ ok: true, message: "Account created!" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ ok: false, message: "Email already in use" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Send verification email
    try {
      const verificationToken = await generateVerificationToken(email, "EMAIL_VERIFICATION");
      await sendVerificationEmail(email, verificationToken.token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    return NextResponse.json(
      { ok: true, message: "Account created! Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ ok: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}
