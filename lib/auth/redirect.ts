const DEFAULT_AFTER_LOGIN = "/admissions/dashboard";

/** Prevent open redirects — only allow same-site relative paths. */
export function sanitizeAuthRedirect(
  path: string | null | undefined,
  fallback = DEFAULT_AFTER_LOGIN
): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}

/** URL Supabase should redirect to after the user clicks the email sign-in link. */
export function authCallbackUrl(redirectAfterLogin?: string): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  const next = sanitizeAuthRedirect(redirectAfterLogin);
  return `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`;
}
