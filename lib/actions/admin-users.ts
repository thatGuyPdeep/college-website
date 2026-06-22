"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, UserRole } from "@/lib/supabase/types";

const adminClient = _adminClient as ReturnType<typeof import("@supabase/supabase-js").createClient>;

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !["admin", "super_admin"].includes((profile as any).role)) {
    throw new Error("Insufficient permissions");
  }
  return { user };
}

export interface UserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export async function listUsers(): Promise<ActionResult<UserRow[]>> {
  try {
    await requireSuperAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return { ok: true, data: (data ?? []) as UserRow[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load users" };
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<ActionResult<void>> {
  try {
    const { user } = await requireSuperAdmin();
    if (userId === user.id) throw new Error("Cannot change your own role");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from("profiles").update({ role }).eq("id", userId);
    if (error) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from("audit_logs").insert({
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
