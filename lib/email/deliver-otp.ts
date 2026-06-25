import { Resend } from "resend";
import {
  RESEND_FROM,
  resendErrorMessage,
  usesResendTestSender,
} from "@/lib/email/resend-config";
import { hasVerifiedResendDomain } from "@/lib/email/otp-config";
import { OTP_SUBJECT, otpEmailHtml } from "@/lib/email/otp-template";
import { isSmtpConfigured, sendViaSmtp } from "@/lib/email/smtp";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendViaResend(
  email: string,
  otp: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "Resend is not configured" };

  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to: email,
    subject: OTP_SUBJECT,
    html: otpEmailHtml(otp),
  });

  if (error) {
    console.error("[otp-email] Resend error:", error);
    return { ok: false, error: resendErrorMessage(error) };
  }
  return { ok: true };
}

function isResendTestRecipientError(error?: string): boolean {
  if (!error) return false;
  const lower = error.toLowerCase();
  return (
    lower.includes("only send testing emails") ||
    lower.includes("verify a domain") ||
    lower.includes("resend.dev")
  );
}

export type OtpDeliveryChannel = "resend" | "smtp" | "resend-test";

/**
 * Send branded 6-digit OTP to any address.
 * Production order: verified Resend domain → SMTP → (dev only) Resend test inbox.
 */
export async function deliverOtpEmail(
  email: string,
  otp: string
): Promise<{ ok: true; channel: OtpDeliveryChannel } | { ok: false; error?: string }> {
  if (hasVerifiedResendDomain()) {
    const result = await sendViaResend(email, otp);
    if (result.ok) return { ok: true, channel: "resend" };
    console.warn("[otp-email] Resend (verified domain) failed:", result.error);
  }

  if (isSmtpConfigured()) {
    const result = await sendViaSmtp(email, OTP_SUBJECT, otpEmailHtml(otp));
    if (result.ok) return { ok: true, channel: "smtp" };
    console.warn("[otp-email] SMTP failed:", result.error);
  }

  // Skip Resend test domain when SMTP is the intended path for hosts without a verified domain
  if (resend && usesResendTestSender() && !isSmtpConfigured()) {
    const result = await sendViaResend(email, otp);
    if (result.ok) return { ok: true, channel: "resend-test" };
    if (!isResendTestRecipientError(result.error)) {
      console.warn("[otp-email] Resend test domain failed:", result.error);
    }
  }

  return { ok: false };
}
