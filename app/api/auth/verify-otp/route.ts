import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json() as { email: string; code: string };

    if (!email || !code || code.length !== 6) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

    // ── 1. Verify the OTP code against the database ─────────────────
    const { data: otpRow, error: fetchErr } = await db
      .from("otp_codes")
      .select("id, expires_at, used")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchErr || !otpRow) {
      return NextResponse.json(
        { error: "Invalid or expired code. Please request a new one." },
        { status: 401 }
      );
    }

    // Mark OTP as used immediately
    await db.from("otp_codes").update({ used: true }).eq("id", otpRow.id);

    // ── 2. Ensure user exists in Supabase Auth ───────────────────────
    const { data: existingData } = await db.auth.admin.getUserByEmail(email.toLowerCase());
    const existingUser = existingData?.user;

    if (!existingUser) {
      // Create new confirmed user
      const { error: createErr } = await db.auth.admin.createUser({
        email:         email.toLowerCase(),
        email_confirm: true,
      });
      if (createErr && !createErr.message.includes("already registered")) {
        throw createErr;
      }
    }

    // ── 3. Generate a magic link to get a valid hashed_token ─────────
    const { data: linkData, error: linkErr } = await db.auth.admin.generateLink({
      type:  "magiclink",
      email: email.toLowerCase(),
    });

    if (linkErr || !linkData?.properties?.hashed_token) {
      console.error("[verify-otp] generateLink error:", linkErr);
      throw new Error("Could not create session token");
    }

    return NextResponse.json({
      ok:         true,
      token_hash: linkData.properties.hashed_token,
    });

  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
