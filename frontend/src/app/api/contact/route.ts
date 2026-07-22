import { NextResponse } from "next/server";
import { resend } from "@/lib/mail";
import { contactFormTemplate } from "@/lib/email-templates";
import { verifyTurnstile } from "@/lib/captcha";

const TURNSTILE_ACTION = "turnstile-spin-v2";

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    req.headers.get("cf-connecting-ip") ||
    forwardedFor ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, subject, message, turnstileToken } = await req.json();

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, message: "Please fill out all fields" },
        { status: 400 }
      );
    }

    const isHuman = await verifyTurnstile(
      turnstileToken,
      getClientIp(req),
      TURNSTILE_ACTION
    );

    if (!isHuman) {
      return NextResponse.json(
        { ok: false, message: "Security verification failed. Please try again." },
        { status: 403 }
      );
    }

    const toEmails = process.env.CONTACT_EMAIL 
      ? process.env.CONTACT_EMAIL.split(',').map(e => e.trim()) 
      : ["jamesezekiel039@gmail.com"];

    const { error } = await resend.emails.send({
      from: "Right Jobs <info@rightjob.net>",
      to: toEmails,
      replyTo: email,
      subject: `New Contact Request: ${subject}`,
      html: contactFormTemplate(firstName, lastName, email, subject, message),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, message: "Failed to send message: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "Failed to send message" },
      { status: 500 }
    );
  }
}
