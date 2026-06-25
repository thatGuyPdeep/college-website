import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import {
  allowDevScreenFallback,
  hasProductionOtpEmail,
  productionOtpSetupHint,
} from "@/lib/email/otp-config";
import { deliverOtpEmail } from "@/lib/email/deliver-otp";
import { usesResendTestSender } from "@/lib/email/resend-config";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_MS = 10 * 60 * 1000;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function persistCustomOtp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  email: string,
  otp: string,
  expires: string
) {
  const { error } = await db
    .from("otp_codes")
    .insert({ email, code: otp, expires_at: expires, used: false });
  if (error) {
    console.error("[send-otp] otp_codes insert error:", error);
    throw new Error("Could not store sign-in code");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = (await req.json()) as { email: string };
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

    const otp = generateOtp();
    const expires = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

    const delivery = await deliverOtpEmail(email, otp);
    if (delivery.ok) {
      await persistCustomOtp(db, email, otp, expires);
      return NextResponse.json({ ok: true, provider: "custom", message: "OTP sent" });
    }

    if (allowDevScreenFallback()) {
      await persistCustomOtp(db, email, otp, expires);
      console.log(`[send-otp] Dev screen fallback — OTP for ${email}: ${otp}`);
      return NextResponse.json({
        ok: true,
        provider: "dev",
        devOtp: otp,
        message: usesResendTestSender()
          ? "Resend test mode only emails the account owner. Use the code below, or configure SMTP / a verified Resend domain."
          : "Email delivery unavailable — code shown on screen (development only)",
      });
    }

    return NextResponse.json(
      {
        error: hasProductionOtpEmail()
          ? "Could not send sign-in code right now. Please try again in a few minutes."
          : productionOtpSetupHint(),
      },
      { status: 503 }
    );
  } catch (err) {
    console.error("[send-otp] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
