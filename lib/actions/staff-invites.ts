"use server";

import { createHash, randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { sendStaffInviteEmail } from "@/lib/email/staff-invite";
import { writeAudit } from "@/lib/audit/log";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { canInviteStaff, canAssignRole } from "@/lib/auth/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function requireInviteAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, is_active")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || (profile as any).is_active === false || !canInviteStaff(role)) {
    throw new Error("Only super admin can invite staff");
  }

  return { user, role, fullName: (profile as { full_name?: string }).full_name };
}

export type StaffInviteRow = {
  id: string;
  email: string;
  role: UserRole;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export async function listPendingInvites(): Promise<ActionResult<StaffInviteRow[]>> {
  try {
    await requireInviteAdmin();
    const { data, error } = await admin
      .from("staff_invites")
      .select("id, email, role, expires_at, accepted_at, created_at")
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { ok: true, data: (data ?? []) as StaffInviteRow[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load invites" };
  }
}

export async function createStaffInvite(email: string, role: UserRole): Promise<ActionResult<{ devToken?: string }>> {
  try {
    const { user, role: assignerRole, fullName } = await requireInviteAdmin();

    if (!canAssignRole(assignerRole, role)) {
      throw new Error(`You cannot assign the role: ${role}`);
    }

    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) throw new Error("Invalid email");

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

    const { error } = await admin.from("staff_invites").insert({
      email:       normalized,
      role,
      invited_by:  user.id,
      token_hash:  tokenHash,
      expires_at:  expiresAt,
    });

    if (error) throw error;

    await writeAudit({
      entity_type: "staff_invite",
      entity_id:   normalized,
      action:      "invite_sent",
      actor_id:    user.id,
      new_value:   { email: normalized, role },
    });

    const emailResult = await sendStaffInviteEmail({
      to:            normalized,
      role,
      inviteToken:   token,
      invitedByName: fullName ?? undefined,
    });

    revalidatePath("/admin/users");

    if (!emailResult.ok) {
      if (process.env.NODE_ENV === "development") {
        return { ok: true, data: { devToken: token } };
      }
      return { ok: false, error: emailResult.error ?? "Failed to send invite email" };
    }

    return { ok: true, data: {} };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invite failed" };
  }
}

/** Called after successful OTP login when ?invite= token present */
export async function acceptStaffInvite(token: string): Promise<ActionResult<{ role: UserRole }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Not authenticated");

    const tokenHash = hashToken(token.trim());
    const { data: invite, error: findErr } = await admin
      .from("staff_invites")
      .select("id, email, role, expires_at, accepted_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (findErr || !invite) throw new Error("Invalid or expired invitation");
    if (invite.accepted_at) throw new Error("Invitation already used");
    if (new Date(invite.expires_at) < new Date()) throw new Error("Invitation expired");

    const userEmail = (user.email ?? "").toLowerCase();
    if (userEmail !== invite.email.toLowerCase()) {
      throw new Error("Sign in with the email address that received the invitation");
    }

    const { error: profileErr } = await admin
      .from("profiles")
      .update({ role: invite.role, is_active: true })
      .eq("id", user.id);

    if (profileErr) throw profileErr;

    await admin
      .from("staff_invites")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invite.id);

    await writeAudit({
      entity_type: "staff_invite",
      entity_id:   invite.id,
      action:      "invite_accepted",
      actor_id:    user.id,
      new_value:   { role: invite.role },
    });

    return { ok: true, data: { role: invite.role as UserRole } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not accept invite" };
  }
}
