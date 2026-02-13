const BRAND_COLOR = "#ea580c";
const DARK_BG = "#0f172a";
const YEAR = new Date().getFullYear();
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rightjob.net";

function baseLayout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: ${DARK_BG}; padding: 32px; text-align: center;">
              <span style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">RIGHT JOBS</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b;">
              &copy; ${YEAR} Right Jobs Inc. All rights reserved.<br>
              PO Box 52, Detroit, ME 04929<br><br>
              <a href="${SITE_URL}" style="color: ${BRAND_COLOR}; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, href: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 8px 0 24px 0;">
        <a href="${href}" style="display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; mso-padding-alt: 0; text-underline-color: ${BRAND_COLOR};">
          <!--[if mso]><i style="mso-font-width: -100%; mso-text-raise: 21pt;">&nbsp;</i><![endif]-->
          <span style="mso-text-raise: 10pt;">${text}</span>
          <!--[if mso]><i style="mso-font-width: -100%;">&nbsp;</i><![endif]-->
        </a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(href: string): string {
  return `
  <p style="margin-bottom: 24px; font-size: 14px; color: #64748b;">Or copy and paste this link into your browser:</p>
  <p style="margin-bottom: 24px; font-size: 13px;"><a href="${href}" style="color: ${BRAND_COLOR}; text-decoration: none; word-break: break-all;">${href}</a></p>`;
}

// ─── Email Verification ──────────────────────────────────────────────

export function verifyEmailTemplate(confirmLink: string): string {
  return baseLayout("Verify Your Email", `
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Verify Your Email Address</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">Thanks for signing up for Right Jobs! Please confirm your email address by clicking the button below. This helps us keep your account secure.</p>
    ${ctaButton("Verify My Email", confirmLink)}
    ${fallbackLink(confirmLink)}
    <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">This link will expire in <strong>1 hour</strong>. If you didn't create a Right Jobs account, you can safely ignore this email.</p>
  `);
}

// ─── Password Reset Request ──────────────────────────────────────────

export function resetPasswordTemplate(resetLink: string): string {
  return baseLayout("Reset Your Password", `
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Reset Your Password</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">We received a request to reset the password for your Right Jobs account. If you didn't make this request, you can safely ignore this email.</p>
    ${ctaButton("Reset Password", resetLink)}
    ${fallbackLink(resetLink)}
    <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">This link will expire in <strong>1 hour</strong>. For security, this link can only be used once.</p>
  `);
}

// ─── Forced Password Reset ───────────────────────────────────────────

export function forcedPasswordResetTemplate(resetLink: string): string {
  return baseLayout("Security Alert: Password Reset Required", `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: #fffbeb; border-radius: 50%; padding: 16px;">
        <span style="font-size: 32px;">🛡️</span>
      </div>
    </div>
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center;">Security Action Required</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">An administrator has initiated a <strong>forced password reset</strong> for your account for security reasons. Your current password has been invalidated and all active sessions have been terminated.</p>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Important:</strong> You must set a new, secure password to regain access to your account.</p>
    </div>
    ${ctaButton("Set New Password", resetLink)}
    ${fallbackLink(resetLink)}
    <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">This secure link will expire in <strong>1 hour</strong>. For your protection, this link can only be used once.</p>
  `);
}

// ─── Password Changed Notice ─────────────────────────────────────────

export function passwordChangedTemplate(): string {
  const supportEmail = process.env.SUPPORT_EMAIL || "info@rightjob.net";
  return baseLayout("Password Changed", `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: #fef2f2; border-radius: 50%; padding: 16px;">
        <span style="font-size: 32px;">🔒</span>
      </div>
    </div>
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center;">Your Password Was Changed</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">Your Right Jobs account password was successfully updated. If you made this change, no further action is required.</p>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Didn't make this change?</strong> Your account may be compromised. Please reset your password immediately and contact our support team at <a href="mailto:${supportEmail}" style="color: ${BRAND_COLOR}; text-decoration: none;">${supportEmail}</a>.</p>
    </div>
  `);
}

// ─── Password Change Verification ────────────────────────────────────

export function passwordChangeVerificationTemplate(confirmLink: string): string {
  return baseLayout("Confirm Password Change", `
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Confirm Your Password Change</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">We received a request to change your Right Jobs account password. Click the button below to confirm this action.</p>
    ${ctaButton("Confirm Password Change", confirmLink)}
    ${fallbackLink(confirmLink)}
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Security notice:</strong> If you didn't request this change, please ignore this email and secure your account immediately.</p>
    </div>
    <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">This link will expire in <strong>1 hour</strong>.</p>
  `);
}

// ─── Admin OTP ───────────────────────────────────────────────────────

export function otpTemplate(otp: string): string {
  return baseLayout("Your Security Code", `
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center;">Your Security Code</h1>
    <p style="margin-bottom: 24px; font-size: 16px; text-align: center;">Use this one-time code to complete your admin authentication:</p>
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px 40px;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${otp}</span>
      </div>
    </div>
    <p style="margin-bottom: 0; font-size: 14px; color: #64748b; text-align: center;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
  `);
}

// ─── Application Confirmation ────────────────────────────────────────

export function applicationConfirmationTemplate(jobTitle: string): string {
  return baseLayout("Application Received", `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: #f0fdf4; border-radius: 50%; padding: 16px;">
        <span style="font-size: 32px;">✅</span>
      </div>
    </div>
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center;">Application Received!</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">Your application for <strong>${jobTitle}</strong> has been successfully submitted and received by the hiring team.</p>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #166534;"><strong>What's next?</strong> The hiring team will review your application and get back to you. You can track your application status on your dashboard.</p>
    </div>
    ${ctaButton("View My Dashboard", `${SITE_URL}/app`)}
  `);
}

// ─── Identity Verification Status ────────────────────────────────────

export function verificationStatusTemplate(status: "VERIFIED" | "REJECTED", notes?: string): string {
  const isVerified = status === "VERIFIED";
  const icon = isVerified ? "🎉" : "⚠️";
  const bgColor = isVerified ? "#f0fdf4" : "#fef2f2";
  const borderColor = isVerified ? "#bbf7d0" : "#fecaca";
  const textColor = isVerified ? "#166534" : "#991b1b";
  const heading = isVerified ? "Identity Verified!" : "Verification Update";
  const message = isVerified
    ? "Congratulations! Your identity has been successfully verified. You now have full access to apply for all jobs on Right Jobs."
    : `Unfortunately, your identity verification was not successful. ${notes ? `<br><br><strong>Reason:</strong> ${notes}` : "Please try again with clearer documents."}`;

  return baseLayout(heading, `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: ${bgColor}; border-radius: 50%; padding: 16px;">
        <span style="font-size: 32px;">${icon}</span>
      </div>
    </div>
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center;">${heading}</h1>
    <div style="background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 15px; color: ${textColor};">${message}</p>
    </div>
    ${isVerified ? ctaButton("Browse Jobs Now", `${SITE_URL}/jobs`) : ctaButton("Try Again", `${SITE_URL}/verify-id`)}
  `);
}

// ─── User Profile Updated by Admin ───────────────────────────────────

export function userProfileUpdatedTemplate(name: string, role: string): string {
  return baseLayout("Account Updated", `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background: #f8fafc; border-radius: 50%; padding: 16px;">
        <span style="font-size: 32px;">📝</span>
      </div>
    </div>
    <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center;">Account Details Updated</h1>
    <p style="margin-bottom: 24px; font-size: 16px;">Hello,</p>
    <p style="margin-bottom: 24px; font-size: 16px;">An administrator has recently updated your account profile information. Here is the current summary of your official details:</p>
    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;"><strong>Display Name:</strong> <span style="color: #0f172a;">${name}</span></p>
      <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Access Role:</strong> <span style="color: #0f172a;">${role}</span></p>
    </div>
    <p style="margin-bottom: 24px; font-size: 14px; color: #64748b; font-style: italic;">If you did not request these changes or believe this is an error, please contact our security team immediately.</p>
    ${ctaButton("Review My Account", `${SITE_URL}/profile`)}
  `);
}
