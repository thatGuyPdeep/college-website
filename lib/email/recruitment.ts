/**
 * Email notifications for faculty recruitment status changes.
 */

import { RESEND_FROM } from "@/lib/email/resend-config";
import type { FacultyAppStatus } from "@/lib/supabase/types";

const COLLEGE = "Ramakrishna Mission Vivekananda College, Narayanpur";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type RecruitmentEmailPayload = {
  to: string;
  applicantName: string;
  vacancyTitle: string;
  status: FacultyAppStatus;
};

function wrap(subject: string, body: string) {
  return {
    subject,
    html: `
<!DOCTYPE html>
<html><head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;color:#1a1a1a;background:#f4f6fb;margin:0;padding:0;">
<table width="100%" cellpadding="0"><tr><td align="center" style="padding:32px 16px;">
<table width="600" style="background:#fff;border-radius:10px;overflow:hidden;">
<tr><td style="background:#0D2660;padding:20px 32px;text-align:center;">
<div style="font-size:18px;font-weight:bold;color:#F5C200;">${COLLEGE}</div>
<div style="font-size:11px;color:#93c5fd;">Faculty Recruitment</div>
</td></tr>
<tr><td style="padding:32px;">${body}</td></tr>
<tr><td style="background:#F0F4FF;padding:16px;text-align:center;font-size:11px;color:#6b7280;">
${COLLEGE} · rkm.narainpur@gmail.com · 07781-252251
</td></tr>
</table></td></tr></table>
</body></html>`,
  };
}

function statusMessage(status: FacultyAppStatus, vacancyTitle: string) {
  const dashboard = `${SITE}/careers/dashboard`;
  switch (status) {
    case "shortlisted":
      return `<p>Your application for <strong>${vacancyTitle}</strong> has been <strong style="color:#4CAF50">shortlisted</strong>.</p>
        <p>Our HR team will contact you with next steps. You may also track status at your careers dashboard.</p>
        <p><a href="${dashboard}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Dashboard</a></p>`;
    case "interview":
      return `<p>Your application for <strong>${vacancyTitle}</strong> has progressed to the <strong style="color:#7c3aed">interview</strong> stage.</p>
        <p>Please watch your email and phone for schedule details from the HR office.</p>
        <p><a href="${dashboard}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Dashboard</a></p>`;
    case "rejected":
      return `<p>Thank you for applying for <strong>${vacancyTitle}</strong>.</p>
        <p>After careful review, we are unable to proceed with your application at this time. We encourage you to apply for future vacancies listed on our careers page.</p>
        <p><a href="${SITE}/careers" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Open Vacancies</a></p>`;
    default:
      return `<p>Your application status for <strong>${vacancyTitle}</strong> is now: <strong>${status}</strong>.</p>
        <p><a href="${dashboard}">Track at careers dashboard</a></p>`;
  }
}

export async function sendRecruitmentStatusEmail(payload: RecruitmentEmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === "development") {
    console.log("[recruitment-email]", payload.status, "→", payload.to);
    return;
  }

  const labels: Record<FacultyAppStatus, string> = {
    submitted:   "Application Received",
    shortlisted: "Application Shortlisted",
    interview:   "Interview Stage",
    rejected:    "Application Update",
  };

  const { subject, html } = wrap(
    `${labels[payload.status]} — ${payload.vacancyTitle}`,
    `<p>Dear <strong>${payload.applicantName}</strong>,</p>${statusMessage(payload.status, payload.vacancyTitle)}`
  );

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    RESEND_FROM,
      to:      payload.to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[recruitment-email]", err);
  }
}
