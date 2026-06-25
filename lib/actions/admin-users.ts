"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit/log";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import {
  can,
  canAssignRole,
  canDeactivateUsers,
  canInviteStaff,
  assignableRoles,
} from "@/lib/auth/permissions";

const adminClient = _adminClient as ReturnType<typeof import("@supabase/supabase-js").createClient>;

async function requireUserAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role, is_active").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || (profile as any).is_active === false || !can(role, "users", "view")) {
    throw new Error("Insufficient permissions");
  }
  return { user, role };
}

export interface UserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export async function listUsers(options?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ users: UserRow[]; total: number }>> {
  try {
    await requireUserAdmin();
    const limit = options?.limit ?? 25;
    const page = options?.page ?? 1;
    const offset = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (adminClient as any)
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.search?.trim()) {
      const q = options.search.trim();
      query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { ok: true, data: { users: (data ?? []) as UserRow[], total: count ?? 0 } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load users" };
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<ActionResult<void>> {
  try {
    const { user, role: assignerRole } = await requireUserAdmin();
    if (!can(assignerRole, "users", "edit")) throw new Error("Cannot edit user roles");
    if (userId === user.id) throw new Error("Cannot change your own role");
    if (!canAssignRole(assignerRole, role)) {
      throw new Error(`You cannot assign the role: ${role}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from("profiles").update({ role }).eq("id", userId);
    if (error) throw error;

    await writeAudit({
      entity_type: "profile",
      entity_id:   userId,
      action:      "role_change",
      actor_id:    user.id,
      new_value:   { role },
    });

    revalidatePath("/admin/users");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function setUserActive(userId: string, isActive: boolean): Promise<ActionResult<void>> {
  try {
    const { user, role } = await requireUserAdmin();
    if (!canDeactivateUsers(role)) throw new Error("Only super admin can deactivate users");
    if (userId === user.id) throw new Error("Cannot deactivate yourself");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any)
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", userId);

    if (error) throw error;

    await writeAudit({
      entity_type: "profile",
      entity_id:   userId,
      action:      isActive ? "user_reactivate" : "user_deactivate",
      actor_id:    user.id,
      new_value:   { is_active: isActive },
    });

    revalidatePath("/admin/users");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function getUserAdminCapabilities(role: UserRole): Promise<{
  canInvite: boolean;
  canDeactivate: boolean;
  assignableRoles: UserRole[];
}> {
  return {
    canInvite:       canInviteStaff(role),
    canDeactivate:   canDeactivateUsers(role),
    assignableRoles: assignableRoles(role),
  };
}
