import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = "Brave Marines <onboarding@resend.dev>";

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    if (!resend) { console.log('[Email] Resend not configured, skipping email'); return false; }
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Welcome to Brave Marines!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A1628;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0A1628,#1a2d4a);padding:40px;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:28px;">Welcome to Brave Marines</h1>
            <p style="color:#94a3b8;margin-top:12px;">Your Maritime Career Starts Here</p>
          </div>
          <div style="padding:30px;">
            <p>Hello <strong style="color:#D4AF37;">${name}</strong>,</p>
            <p>Thank you for joining Brave Marines - the leading maritime recruitment platform. We're excited to have you on board!</p>
            <p>Complete your profile to get discovered by top maritime companies worldwide.</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="#" style="background:#D4AF37;color:#0A1628;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Complete Your Profile</a>
            </div>
            <p style="color:#64748b;font-size:13px;">Fair winds and following seas!</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[Email] Failed to send welcome email:", e);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  try {
    if (!resend) { console.log('[Email] Resend not configured, skipping email'); return false; }
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Reset Your Password - Brave Marines",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A1628;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0A1628,#1a2d4a);padding:40px;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:28px;">Password Reset</h1>
          </div>
          <div style="padding:30px;">
            <p>You requested a password reset. Click the button below to set a new password:</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${resetUrl}" style="background:#D4AF37;color:#0A1628;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a>
            </div>
            <p style="color:#64748b;font-size:13px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[Email] Failed to send reset email:", e);
    return false;
  }
}

export async function sendVerificationStatusEmail(to: string, name: string, approved: boolean) {
  try {
    if (!resend) { console.log('[Email] Resend not configured, skipping email'); return false; }
    await resend.emails.send({
      from: FROM,
      to,
      subject: approved ? "Account Verified! - Brave Marines" : "Verification Update - Brave Marines",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A1628;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0A1628,#1a2d4a);padding:40px;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:28px;">${approved ? "Congratulations!" : "Verification Update"}</h1>
          </div>
          <div style="padding:30px;">
            <p>Hello <strong style="color:#D4AF37;">${name}</strong>,</p>
            ${approved
              ? "<p>Your account has been verified! You now have a verified badge on your profile.</p>"
              : "<p>Unfortunately, your verification request was not approved at this time. Please review your documents and try again.</p>"
            }
          </div>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[Email] Failed to send verification email:", e);
    return false;
  }
}
