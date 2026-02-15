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
  issueReportTemplate,
} from "@/lib/email-templates";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM = '"Right Jobs" <info@rightjob.net>';
const ONBOARDING_FROM = '"Right Jobs Support" <onboarding@rightjob.net>';

// ─── Email Verification ──────────────────────────────────────────────

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "RightJobs: Verify your email",
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
      subject: "RightJobs: Reset your password",
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
      subject: "RightJobs: Security Alert - Password Reset Required",
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
      subject: "RightJobs: Your security code",
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
      subject: `RightJobs: Application Received - ${jobTitle}`,
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
      subject: `RightJobs: ${status === "VERIFIED" ? "Identity Verified!" : "Identity Verification Update"}`,
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
      subject: "RightJobs: Confirm password change",
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
      subject: "RightJobs: Security Alert - Password Changed",
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
      subject: "RightJobs: Important - Your account profile has been updated",
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

// ─── Issue Reporting ─────────────────────────────────────────────────

export const sendIssueReportEmail = async (
  userEmail: string, 
  description: string, 
  attachments: { filename: string; content: string }[] = []
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Right Jobs <info@rightjob.net>",
      to: "jamesezekiel039@gmail.com",
      subject: `RightJobs: System Issue Alert - ${userEmail}`,
      html: issueReportTemplate(userEmail, description),
      attachments: attachments,
    });

    if (error) {
      console.error("Resend error (issue report):", error);
      throw new Error(`Failed to send issue report email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Send issue report email error:", error);
    // Don't re-throw, just log it so the user sees a success but we know it failed?
    // Actually, report-issue API catches it.
    throw error;
  }
};
