import { Resend } from "resend";
import {
  verifyEmailTemplate,
  resetPasswordTemplate,
  passwordChangedTemplate,
  passwordChangeVerificationTemplate,
  otpTemplate,
  applicationConfirmationTemplate,
  verificationStatusTemplate,
} from "@/lib/email-templates";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM = process.env.EMAIL_FROM || "Right Jobs <info@se7eninc.com>";

// ─── Email Verification ──────────────────────────────────────────────

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your email — RightJobs",
    html: verifyEmailTemplate(confirmLink),
  });
};

// ─── Password Reset ──────────────────────────────────────────────────

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your password — RightJobs",
    html: resetPasswordTemplate(resetLink),
  });
};

// ─── Admin OTP ───────────────────────────────────────────────────────

export const sendOTPEmail = async (email: string, otp: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your security code — RightJobs",
    html: otpTemplate(otp),
  });
};

// ─── Application Confirmation ────────────────────────────────────────

export const sendApplicationConfirmationEmail = async (email: string, jobTitle: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Application Received: ${jobTitle} — RightJobs`,
    html: applicationConfirmationTemplate(jobTitle),
  });
};

// ─── Identity Verification Status ────────────────────────────────────

export const sendVerificationStatusEmail = async (email: string, status: "VERIFIED" | "REJECTED", notes?: string) => {
  const subject = status === "VERIFIED" ? "Identity Verified!" : "Identity Verification Update";

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${subject} — RightJobs`,
    html: verificationStatusTemplate(status, notes),
  });
};

// ─── Password Change Verification ────────────────────────────────────

export const sendPasswordChangeVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/change-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirm password change — RightJobs",
    html: passwordChangeVerificationTemplate(confirmLink),
  });
};

// ─── Password Changed Notice ─────────────────────────────────────────

export const sendPasswordChangedNoticeEmail = async (email: string) => {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Security Alert: Password Changed — RightJobs",
    html: passwordChangedTemplate(),
  });
};
