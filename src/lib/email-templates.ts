
export const resetPasswordTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #0f172a; padding: 32px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: 800; text-decoration: none; letter-spacing: -0.5px; }
    .content { padding: 40px 32px; }
    .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .p { margin-bottom: 24px; font-size: 16px; }
    .button { display: inline-block; background-color: #ea580c; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 8px 0 24px 0; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; }
    .link { color: #ea580c; text-decoration: none; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RIGHT JOBS</div>
    </div>
    <div class="content">
      <h1 class="h1">Reset Your Password</h1>
      <p class="p">We received a request to reset the password for your RightJobs account. If you didn't make this request, you can safely ignore this email.</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <p class="p">Or copy and paste this link into your browser:</p>
      <p class="p"><a href="${resetLink}" class="link">${resetLink}</a></p>
      <p class="p">This link will expire in 1 hour.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} RightJobs Inc. All rights reserved.<br>
      PO Box 52, Detroit, ME 04929
    </div>
  </div>
</body>
</html>
`;
