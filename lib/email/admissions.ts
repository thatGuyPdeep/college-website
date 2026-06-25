/**
 * Email utility for admissions notifications.
 * Uses Resend (https://resend.com) — set RESEND_API_KEY in .env
 * Falls back to console.log in development when key is missing.
 */

import { RESEND_FROM } from "@/lib/email/resend-config";

const FROM = RESEND_FROM;
const COLLEGE = "Ramakrishna Mission Vivekananda College, Narayanpur";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type EmailPayload =
  | { type: "submitted";     to: string; applicantName: string; applicationNo: string }
  | { type: "under_review";  to: string; applicantName: string; applicationNo: string }
  | { type: "approved";      to: string; applicantName: string; applicationNo: string; reason?: string }
  | { type: "rejected";      to: string; applicantName: string; applicationNo: string; reason?: string }
  | { type: "waitlisted";    to: string; applicantName: string; applicationNo: string; reason?: string }
  | { type: "docs_requested"; to: string; applicantName: string; applicationNo: string; docTypes: string[]; message: string };

function buildEmail(payload: EmailPayload): { subject: string; html: string } {
  const dashboardUrl = `${SITE}/admissions/dashboard`;

  const wrap = (subject: string, body: string) => ({
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;color:#1a1a1a;background:#f4f6fb;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0D2660;padding:20px 32px;text-align:center;">
            <div style="font-size:18px;font-weight:bold;color:#F5C200;">${COLLEGE}</div>
            <div style="font-size:11px;color:#93c5fd;margin-top:4px;">Narayanpur, Chhattisgarh</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F0F4FF;padding:16px 32px;text-align:center;font-size:11px;color:#6b7280;">
            ${COLLEGE} &nbsp;|&nbsp; rkm.narainpur@gmail.com &nbsp;|&nbsp; 07781-252251<br/>
            <em style="color:#9ca3af;">आत्मनो मोक्षार्थं जगद्धिताय च</em>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`,
  });

  switch (payload.type) {
    case "submitted": return wrap(
      `Application Received — ${payload.applicationNo}`,
      `<p>Dear <strong>${payload.applicantName}</strong>,</p>
       <p>We have successfully received your application for admission to <strong>${COLLEGE}</strong>.</p>
       <table width="100%" style="background:#F0F4FF;border-radius:8px;padding:16px;margin:20px 0;" cellpadding="8">
         <tr><td style="color:#555;width:40%">Application No</td><td><strong style="color:#C8201A">${payload.applicationNo}</strong></td></tr>
         <tr><td style="color:#555">Status</td><td><strong style="color:#2196F3">Submitted</strong></td></tr>
       </table>
       <p>Our admissions team will review your application. You will receive an update within 7–10 working days.</p>
       <p style="margin-top:24px"><a href="${dashboardUrl}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Track Your Application</a></p>
       <p style="color:#9ca3af;font-size:11px;margin-top:24px">Please keep your Application Number safe for future reference.</p>`
    );

    case "under_review": return wrap(
      `Application Under Review — ${payload.applicationNo}`,
      `<p>Dear <strong>${payload.applicantName}</strong>,</p>
       <p>Your application <strong>${payload.applicationNo}</strong> is now <strong style="color:#7c3aed">under review</strong> by our admissions committee.</p>
       <p>We will notify you once a decision is made. No action is required from you at this time unless we request additional documents.</p>
       <p style="margin-top:24px"><a href="${dashboardUrl}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Track Your Application</a></p>`
    );

    case "approved": return wrap(
      `Congratulations! Application Approved — ${payload.applicationNo}`,
      `<p>Dear <strong>${payload.applicantName}</strong>,</p>
       <p>We are delighted to inform you that your application <strong>${payload.applicationNo}</strong> has been <strong style="color:#4CAF50">APPROVED</strong>.</p>
       ${payload.reason ? `<p style="background:#f0fdf4;border-left:4px solid #4CAF50;padding:12px;border-radius:4px;">${payload.reason}</p>` : ""}
       <p>Please log in to your dashboard to complete the admission formalities.</p>
       <p style="margin-top:24px"><a href="${dashboardUrl}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Complete Admission Formalities</a></p>`
    );

    case "rejected": return wrap(
      `Admission Decision — ${payload.applicationNo}`,
      `<p>Dear <strong>${payload.applicantName}</strong>,</p>
       <p>We regret to inform you that after careful review, we are unable to offer you admission for Application No <strong>${payload.applicationNo}</strong>.</p>
       ${payload.reason ? `<p style="background:#fff5f5;border-left:4px solid #f44336;padding:12px;border-radius:4px;">${payload.reason}</p>` : ""}
       <p>We encourage you to apply in future academic sessions. For queries, please contact our admissions office.</p>`
    );

    case "waitlisted": return wrap(
      `Waitlisted — ${payload.applicationNo}`,
      `<p>Dear <strong>${payload.applicantName}</strong>,</p>
       <p>Your application <strong>${payload.applicationNo}</strong> has been placed on our <strong style="color:#FF5722">waitlist</strong>.</p>
       ${payload.reason ? `<p style="background:#fff8f0;border-left:4px solid #FF5722;padding:12px;border-radius:4px;">${payload.reason}</p>` : ""}
       <p>We will notify you if a seat becomes available. Please track your status on the dashboard.</p>
       <p style="margin-top:24px"><a href="${dashboardUrl}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Track Status</a></p>`
    );

    case "docs_requested": return wrap(
      `Action Required: Additional Documents — ${payload.applicationNo}`,
      `<p>Dear <strong>${payload.applicantName}</strong>,</p>
       <p>Our admissions team requires additional documents for your application <strong>${payload.applicationNo}</strong>.</p>
       <p style="background:#eff6ff;border-left:4px solid #0D2660;padding:12px;border-radius:4px;">${payload.message}</p>
       <p><strong>Documents required:</strong></p>
       <ul>${payload.docTypes.map(d => `<li>${d.replace(/_/g, " ")}</li>`).join("")}</ul>
       <p style="margin-top:24px"><a href="${dashboardUrl}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Upload Documents</a></p>`
    );
  }
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { subject, html } = buildEmail(payload);

  // In development without RESEND_API_KEY, log to console
  if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === "development") {
    console.log(`[email:${payload.type}] To: ${payload.to} | Subject: ${subject}`);
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to: payload.to, subject, html });
  } catch (err) {
    // Never let email failures break the main flow
    console.error("[email] send failed:", err);
  }
}
