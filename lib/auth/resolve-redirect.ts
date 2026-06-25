import { sanitizeAuthRedirect } from "@/lib/auth/redirect";
import { MFA_REQUIRED_ROLES, STAFF_ROLES } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/supabase/types";

export type PostLoginResult = {
  redirect: string;
  error?: "staff_required" | "deactivated";
  role?: UserRole;
};

/** Pure redirect logic — shared by client + server. */
export function resolveRedirectForRole(
  role: UserRole,
  requestedPath?: string | null,
  options?: { needsMfa?: boolean; isActive?: boolean },
): PostLoginResult {
  const requested = requestedPath?.trim() || null;
  const isActive = options?.isActive !== false;

  if (!isActive) {
    return { redirect: "/login?error=deactivated", error: "deactivated", role };
  }

  const wantsAdmin =
    !requested ||
    requested === "/" ||
    requested.startsWith("/admin");

  if (STAFF_ROLES.includes(role)) {
    const target = wantsAdmin ? "/admin" : sanitizeAuthRedirect(requested);

    if (options?.needsMfa && target.startsWith("/admin")) {
      return {
        redirect: `/mfa?redirect=${encodeURIComponent(target)}`,
        role,
      };
    }

    return { redirect: target, role };
  }

  if (requested?.startsWith("/admin")) {
    return {
      redirect: "/login?error=staff_required&redirect=%2Fadmin",
      error: "staff_required",
      role,
    };
  }

  return { redirect: sanitizeAuthRedirect(requested), role };
}

export function parseBootstrapAdminEmails(): string[] {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));
}

/** Promote configured emails to super_admin (first-time setup). */
export async function applyBootstrapAdminRole(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  email: string,
): Promise<UserRole | null> {
  const normalized = email.trim().toLowerCase();
  const bootstrap = parseBootstrapAdminEmails();
  if (!bootstrap.includes(normalized)) return null;

  const { data: listData, error: listErr } = await db.auth.admin.listUsers();
  if (listErr) {
    console.error("[bootstrap-admin] listUsers:", listErr.message);
    return null;
  }

  const authUser = listData?.users?.find(
    (u: { email?: string }) => u.email?.toLowerCase() === normalized,
  );
  if (!authUser?.id) {
    console.error("[bootstrap-admin] auth user not found for", normalized);
    return null;
  }

  const { error } = await db
    .from("profiles")
    .upsert(
      { id: authUser.id, email: normalized, role: "super_admin" },
      { onConflict: "id" },
    );

  if (error) {
    console.error("[bootstrap-admin] profile upsert:", error.message);
    return null;
  }

  return "super_admin";
}
