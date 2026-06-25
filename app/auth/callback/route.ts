import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { sanitizeAuthRedirect } from "@/lib/auth/redirect";
import { resolvePostLoginRedirect } from "@/lib/auth/post-login-redirect";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles Supabase magic-link / OAuth callbacks.
 * Supabase redirects here with ?code=... (PKCE) or ?token_hash=...&type=...
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = sanitizeAuthRedirect(searchParams.get("next"));

  const supabase = await createClient();

  async function redirectAfterAuth() {
    const { redirect } = await resolvePostLoginRedirect(next);
    return NextResponse.redirect(`${origin}${redirect}`);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return await redirectAfterAuth();
    }
    console.error("[auth/callback] code exchange error:", error.message);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      return await redirectAfterAuth();
    }
    console.error("[auth/callback] token_hash verify error:", error.message);
  }

  return NextResponse.redirect(
    `${origin}/login?error=auth_failed&redirect=${encodeURIComponent(next)}`
  );
}
