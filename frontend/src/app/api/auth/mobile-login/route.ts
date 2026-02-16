import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  console.log("[API/AUTH/LOGIN] Request received");
  try {
    const { success } = await rateLimit(10, 60000);
    if (!success) {
      console.log("[API/AUTH/LOGIN] Rate limit exceeded");
      return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
      console.log("[API/AUTH/LOGIN] Body parsed:", { email: body.email });
    } catch (e) {
      console.error("[API/AUTH/LOGIN] Failed to parse body:", e);
      return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
    }

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      console.log("[API/AUTH/LOGIN] Zod validation failed:", result.error.flatten().fieldErrors);
      return NextResponse.json({ 
        ok: false, 
        message: "Validation failed", 
        fieldErrors: result.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      console.log("[API/AUTH/LOGIN] User not found or no password hash");
      return NextResponse.json({ ok: false, message: "Invalid email or password" }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      console.log("[API/AUTH/LOGIN] Password mismatch");
      return NextResponse.json({ ok: false, message: "Invalid email or password" }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 })).toString('base64');

    console.log("[API/AUTH/LOGIN] Login successful for:", email);
    return NextResponse.json({
      ok: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mfaComplete: user.role !== "ADMIN",
      }
    });
  } catch (error) {
    console.error("[API/AUTH/LOGIN] Unexpected error:", error);
    return NextResponse.json({ ok: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}
