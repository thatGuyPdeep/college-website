import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminClient } from "@/lib/supabase/admin";
import { RESEND_FROM, resendErrorMessage, usesResendTestSender } from "@/lib/email/resend-config";
import { sendSupabaseOtp } from "@/lib/email/supabase-otp";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS   = 5;
const OTP_EXPIRY_MS  = 10 * 60 * 1000;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpEmailHtml(otp: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <div style="background:#0D2660;padding:20px;border-radius:10px 10px 0 0;text-align:center;">
        <h2 style="color:#F5C200;margin:0;font-size:18px;">Ramakrishna Mission College</h2>
        <p style="color:#93c5fd;margin:4px 0 0;font-size:12px;">Narayanpur, Chhattisgarh</p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 10px 10px;">
        <p style="color:#374151;margin:0 0 16px;">Your sign-in code is:</p>
        <div style="background:#F0F4FF;border:2px solid #0D2660;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
          <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#0D2660;font-family:monospace;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;margin:0;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:16px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

async function sendViaResend(email: string, otp: string) {
  if (!resend) return { ok: false as const, error: "Resend is not configured" };

  const { error } = await resend.emails.send({
    from:    RESEND_FROM,
    to:      email,
    subject: "Your Sign-in Code — RKM College",
    html:    otpEmailHtml(otp),
  });

  if (error) {
    console.error("[send-otp] Resend error:", error);
    return { ok: false as const, error: resendErrorMessage(error) };
  }
  return { ok: true as const };
}

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = await req.json() as { email: string };
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { data: recent } = await db
      .from("otp_codes")
      .select("id")
      .eq("email", email)
      .gte("created_at", since);

    if ((recent?.length ?? 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    const otp     = generateOtp();
    const expires = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

    // ── 1. Resend (best for production with a verified domain) ──────────
    if (resend && !usesResendTestSender()) {
      const resendResult = await sendViaResend(email, otp);
      if (resendResult.ok) {
        await db.from("otp_codes").insert({ email, code: otp, expires_at: expires, used: false });
        return NextResponse.json({ ok: true, provider: "custom", message: "OTP sent" });
      }
      console.warn("[send-otp] Resend failed, trying Supabase OTP:", resendResult.error);
    }

    // ── 2. Supabase Auth email (works for any address; ~2/hour on free tier) ─
    const supabaseResult = await sendSupabaseOtp(email);
    if (supabaseResult.ok) {
      return NextResponse.json({
        ok:       true,
        provider: "supabase",
        message:  "Sign-in code sent to your email",
      });
    }

    console.warn("[send-otp] Supabase OTP failed:", supabaseResult.error);

    let resendError: string | undefined;

    // ── 3. Resend test domain (only delivers to the Resend account owner) ─
    if (resend && usesResendTestSender()) {
      const resendResult = await sendViaResend(email, otp);
      if (resendResult.ok) {
        await db.from("otp_codes").insert({ email, code: otp, expires_at: expires, used: false });
        return NextResponse.json({ ok: true, provider: "custom", message: "OTP sent" });
      }
      resendError = resendResult.error;
      console.warn("[send-otp] Resend test domain failed:", resendError);
    }

    // ── 4. Local dev: show OTP on screen when mail delivery is unavailable ─
    if (process.env.NODE_ENV === "development") {
      await db.from("otp_codes").insert({
        email,
        code:       otp,
        expires_at: expires,
        used:       false,
      });
      console.log(`[send-otp] DEV ONLY — OTP for ${email}: ${otp}`);
      return NextResponse.json({
        ok:       true,
        provider: "dev",
        devOtp:   otp,
        message:  "Email delivery unavailable — code shown on screen (development only)",
      });
    }

    const detail = supabaseResult.error ?? resendError;
    return NextResponse.json(
      {
        error:
          detail ??
          "Could not send sign-in code. Verify a domain in Resend (RESEND_FROM_EMAIL) or configure Supabase custom SMTP.",
      },
      { status: 503 }
    );
  } catch (err) {
    console.error("[send-otp] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
