import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles Supabase magic-link / OAuth callbacks.
 * Supabase redirects here with ?code=... after email sign-in.
 * We exchange the code for a session and redirect the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admissions/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] code exchange error:", error.message);
  }

  // Something went wrong — send back to login with error flag
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
