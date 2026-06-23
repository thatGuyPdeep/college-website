import nodemailer from "nodemailer";

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD?.trim()
  );
}

/**
 * Generic SMTP delivery (Gmail app password, SendGrid SMTP, etc.).
 * Works for any recipient — use when Resend is still on the test domain.
 */
export async function sendViaSmtp(
  to: string,
  subject: string,
  html: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!smtpConfigured()) {
    return { ok: false, error: "SMTP is not configured" };
  }

  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASSWORD!.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from =
    process.env.SMTP_FROM?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `Ramakrishna Mission College <${user}>`;

  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transport.sendMail({ from, to, subject, html });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMTP send failed";
    console.error("[smtp] send error:", message);
    return { ok: false, error: message };
  }
}

export function isSmtpConfigured(): boolean {
  return smtpConfigured();
}
