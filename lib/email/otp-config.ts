import { usesResendTestSender } from "@/lib/email/resend-config";
import { isSmtpConfigured } from "@/lib/email/smtp";

/** Resend with a verified custom domain (not @resend.dev). */
export function hasVerifiedResendDomain(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && !usesResendTestSender());
}

/** Production-ready OTP email: verified Resend domain or SMTP. */
export function hasProductionOtpEmail(): boolean {
  return hasVerifiedResendDomain() || isSmtpConfigured();
}

/** Show OTP on screen — local development only. Never enabled in production builds. */
export function allowDevScreenFallback(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NODE_ENV === "development" || process.env.OTP_SCREEN_FALLBACK === "true";
}

export function productionOtpSetupHint(): string {
  return (
    "Configure email for sign-in: verify a domain in Resend and set RESEND_FROM_EMAIL " +
    "(e.g. College <admissions@yourcollege.edu.in>), or set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD."
  );
}
