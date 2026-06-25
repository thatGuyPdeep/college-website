import { MFA_REQUIRED_ROLES } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";
import { resolveRedirectForRole, type PostLoginResult } from "@/lib/auth/resolve-redirect";

export type { PostLoginResult };

/** Decide where to send the user after a successful OTP / magic-link sign-in. */
export async function resolvePostLoginRedirect(
  requestedPath?: string | null,
): Promise<PostLoginResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return resolveRedirectForRole("applicant", requestedPath);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = ((profile as any)?.role ?? "applicant") as UserRole;

  const { data: activeRow } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", user.id)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isActive = (activeRow as any)?.is_active !== false;

  let needsMfa = false;
  if (MFA_REQUIRED_ROLES.includes(role)) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    needsMfa = Boolean(aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2");
  }

  return resolveRedirectForRole(role, requestedPath, { needsMfa, isActive });
}
