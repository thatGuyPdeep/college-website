/** Shared Resend sender — set RESEND_FROM_EMAIL once a domain is verified in Resend. */
export const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL?.trim() ||
  "Ramakrishna Mission Vivekananda College <onboarding@resend.dev>";

export function usesResendTestSender(): boolean {
  return RESEND_FROM.includes("@resend.dev");
}

export function resendErrorMessage(error: { message?: string } | null): string {
  const msg = error?.message ?? "";
  if (
    msg.includes("only send testing emails") ||
    msg.includes("verify a domain") ||
    msg.includes("resend.dev")
  ) {
    return "The test email domain can only deliver to the Resend account owner. We will try an alternate delivery method.";
  }
  return msg || "Failed to send email";
}
