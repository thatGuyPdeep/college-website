/**
 * Sends payment receipt PDF to applicant after successful Razorpay payment.
 */

import { RESEND_FROM } from "@/lib/email/resend-config";
import { generatePaymentReceiptPdf } from "@/lib/pdf/generate-payment-receipt";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { PersonalData } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const COLLEGE = "Ramakrishna Mission Vivekananda College, Narayanpur";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function sendPaymentReceiptEmail(applicationId: string): Promise<void> {
  const { data: app } = await admin
    .from("applications")
    .select("application_no, personal_data")
    .eq("id", applicationId)
    .single();

  if (!app) return;

  const { data: payment } = await admin
    .from("payments")
    .select("amount, razorpay_order_id, razorpay_payment_id, updated_at, created_at")
    .eq("application_id", applicationId)
    .eq("status", "paid")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!payment) return;

  const pd = app.personal_data as PersonalData | null;
  const email = pd?.email?.trim();
  if (!email) return;

  const pdf = await generatePaymentReceiptPdf({
    applicationNo: app.application_no,
    applicantName: pd?.full_name ?? "Applicant",
    amount:        Number(payment.amount),
    paidAt:        payment.updated_at ?? payment.created_at,
    orderId:       payment.razorpay_order_id,
    paymentId:     payment.razorpay_payment_id,
  });

  const dashboard = `${SITE}/admissions/dashboard`;
  const subject = `Payment Receipt — ${app.application_no ?? "Admission Fee"}`;
  const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1a1a1a;">
<p>Dear <strong>${pd?.full_name ?? "Applicant"}</strong>,</p>
<p>Thank you for paying the admission application fee for <strong>${COLLEGE}</strong>.</p>
<p>Your payment receipt is attached as a PDF. You can also download it anytime from your admissions dashboard.</p>
<p><a href="${dashboard}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Admissions Dashboard</a></p>
<p style="color:#888;font-size:11px;">Application No: ${app.application_no ?? "—"}</p>
</body></html>`;

  if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === "development") {
    console.log("[payment-receipt-email] To:", email, "| Subject:", subject, "| PDF bytes:", pdf.length);
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    RESEND_FROM,
      to:      email,
      subject,
      html,
      attachments: [{
        filename: `payment-receipt-${app.application_no ?? applicationId.slice(0, 8)}.pdf`,
        content:  pdf,
      }],
    });
  } catch (err) {
    console.error("[payment-receipt-email]", err);
  }
}
