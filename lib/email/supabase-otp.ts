/**
 * Fallback OTP delivery via Supabase Auth (built-in email).
 * Rate-limited on free tier (~2/hour) but works for any recipient.
 */
export async function sendSupabaseOtp(email: string): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const res = await fetch(`${url}/auth/v1/otp`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      apikey:         anon,
      Authorization:  `Bearer ${anon}`,
    },
    body: JSON.stringify({
      email:        email.toLowerCase(),
      create_user:  true,
    }),
  });

  if (res.ok) return { ok: true };

  let message = "Could not send sign-in code";
  try {
    const body = await res.json() as { msg?: string; error_description?: string; message?: string };
    message = body.msg ?? body.error_description ?? body.message ?? message;
  } catch {
    /* ignore */
  }

  if (res.status === 429 || message.toLowerCase().includes("rate")) {
    return {
      ok:    false,
      error: "Email rate limit reached. Please wait an hour or verify a custom domain in Resend.",
    };
  }

  return { ok: false, error: message };
}
