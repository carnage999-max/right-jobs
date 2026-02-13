import { Resend } from "resend";
import {
  verifyEmailTemplate,
  resetPasswordTemplate,
  forcedPasswordResetTemplate,
  passwordChangedTemplate,
  passwordChangeVerificationTemplate,
  otpTemplate,
  applicationConfirmationTemplate,
  verificationStatusTemplate,
  userProfileUpdatedTemplate,
} from "@/lib/email-templates";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM = process.env.EMAIL_FROM || "RightJobs <info@se7eninc.com>";

// ─── Email Verification ──────────────────────────────────────────────

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verify your email — RightJobs",
      html: verifyEmailTemplate(confirmLink),
    });

    if (error) {
      console.error("Resend error (verification):", error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send verification email error:", error);
    throw error;
  }
};

// ─── Password Reset ──────────────────────────────────────────────────

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reset your password — RightJobs",
      html: resetPasswordTemplate(resetLink),
    });

    if (error) {
      console.error("Resend error (password reset):", error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send password reset email error:", error);
    throw error;
  }
};

export const sendForcedPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Security Alert: Password Reset Required — RightJobs",
      html: forcedPasswordResetTemplate(resetLink),
    });

    if (error) {
      console.error("Resend error (forced password reset):", error);
      throw new Error(`Failed to send forced password reset email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send forced password reset email error:", error);
    throw error;
  }
};

// ─── Admin OTP ───────────────────────────────────────────────────────

export const sendOTPEmail = async (email: string, otp: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your security code — RightJobs",
      html: otpTemplate(otp),
    });

    if (error) {
      console.error("Resend error (OTP):", error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send OTP email error:", error);
    throw error;
  }
};

// ─── Application Confirmation ────────────────────────────────────────

export const sendApplicationConfirmationEmail = async (email: string, jobTitle: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Application Received: ${jobTitle} — RightJobs`,
      html: applicationConfirmationTemplate(jobTitle),
    });

    if (error) {
      console.error("Resend error (application confirmation):", error);
      throw new Error(`Failed to send application confirmation email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send application confirmation email error:", error);
    throw error;
  }
};

// ─── Identity Verification Status ────────────────────────────────────

export const sendVerificationStatusEmail = async (email: string, status: "VERIFIED" | "REJECTED", notes?: string) => {
  const subject = status === "VERIFIED" ? "Identity Verified!" : "Identity Verification Update";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `${subject} — RightJobs`,
      html: verificationStatusTemplate(status, notes),
    });

    if (error) {
      console.error("Resend error (verification status):", error);
      throw new Error(`Failed to send verification status email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send verification status email error:", error);
    throw error;
  }
};

// ─── Password Change Verification ────────────────────────────────────

export const sendPasswordChangeVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/change-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Confirm password change — RightJobs",
      html: passwordChangeVerificationTemplate(confirmLink),
    });

    if (error) {
      console.error("Resend error (password change verification):", error);
      throw new Error(`Failed to send password change verification email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send password change verification email error:", error);
    throw error;
  }
};

// ─── Password Changed Notice ─────────────────────────────────────────

export const sendPasswordChangedNoticeEmail = async (email: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Security Alert: Password Changed — RightJobs",
      html: passwordChangedTemplate(),
    });

    if (error) {
      console.error("Resend error (password changed notice):", error);
      throw new Error(`Failed to send password changed notice email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send password changed notice email error:", error);
    throw error;
  }
};

// ─── User Profile Updated by Admin ───────────────────────────────────

export const sendUserProfileUpdatedEmail = async (email: string, name: string, role: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Important: Your account profile has been updated — RightJobs",
      html: userProfileUpdatedTemplate(name, role),
    });

    if (error) {
      console.error("Resend error (user profile updated):", error);
      throw new Error(`Failed to send user profile updated email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send user profile updated email error:", error);
    throw error;
  }
};
