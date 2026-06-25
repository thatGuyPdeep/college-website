import { Resend } from "resend";
import { RESEND_FROM } from "@/lib/email/resend-config";
import { SITE_FULL_NAME, SITE_URL } from "@/lib/utils/constants";

export async function sendStaffInviteEmail(params: {
  to: string;
  role: string;
  inviteToken: string;
  invitedByName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "Email is not configured" };
  }

  const loginUrl = `${SITE_URL}/login?invite=${encodeURIComponent(params.inviteToken)}&redirect=/admin`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: params.to,
      subject: `Staff portal invitation — ${SITE_FULL_NAME}`,
      html: `
        <p>You have been invited to the <strong>${SITE_FULL_NAME}</strong> staff portal as <strong>${params.role.replace(/_/g, " ")}</strong>.</p>
        ${params.invitedByName ? `<p>Invited by: ${params.invitedByName}</p>` : ""}
        <p><a href="${loginUrl}">Accept invitation and sign in</a></p>
        <p>This link expires in 7 days. Sign in with this email address using the OTP code we send you.</p>
        <p style="color:#666;font-size:12px">If you did not expect this email, please ignore it.</p>
      `,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to send email" };
  }
}
