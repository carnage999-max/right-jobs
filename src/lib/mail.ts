import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Verify your email - RightJobs",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Reset your password - RightJobs",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

export const sendOTPEmail = async (email: string, otp: string) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Your Admin OTP - RightJobs",
    html: `<p>Your OTP code is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
};

export const sendApplicationConfirmationEmail = async (email: string, jobTitle: string) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: `Application Received: ${jobTitle}`,
    html: `<p>Your application for <strong>${jobTitle}</strong> has been received by the hiring team.</p><p>You can track your status on your dashboard.</p>`,
  });
};

export const sendVerificationStatusEmail = async (email: string, status: "VERIFIED" | "REJECTED", notes?: string) => {
  const subject = status === "VERIFIED" ? "Identity Verified!" : "Identity Verification Update";
  const message = status === "VERIFIED" 
    ? "Congratulations! Your identity has been verified. You now have full access to apply for all jobs."
    : `Unfortunately, your identity verification was not successful. ${notes ? `Reason: ${notes}` : "Please try again with clearer documents."}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: `${subject} - RightJobs`,
    html: `<p>${message}</p>`,
  });
};

export const sendPasswordChangeVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/change-password?token=${token}`;
  
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Confirm password change - RightJobs",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm you want to change your password.</p><p>If you didn't request this, please secure your account immediately.</p>`,
    });
  };

export const sendPasswordChangedNoticeEmail = async (email: string) => {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Security Alert: Password Changed",
      html: `<p>Your RightJobs password was successfully changed. If this wasn't you, please contact support immediately.</p>`,
    });
  };
