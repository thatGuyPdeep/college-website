"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type StaffNotificationType =
  | "application_submitted"
  | "application_payment"
  | "contact_enquiry"
  | "faculty_application"
  | "content_draft"
  | "task_assigned"
  | "system";

export type StaffNotification = {
  id: string;
  type: StaffNotificationType;
  title: string;
  body: string | null;
  href: string | null;
  entity_type: string | null;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
};

export type NotifyStaffParams = {
  type: StaffNotificationType;
  title: string;
  body?: string;
  href?: string;
  entity_type?: string;
  entity_id?: string;
  target_role?: UserRole;
  user_id?: string;
};

/** Service-role insert — call from server actions / webhooks */
export async function notifyStaff(params: NotifyStaffParams): Promise<void> {
  try {
    await admin.from("staff_notifications").insert({
      type:        params.type,
      title:       params.title,
      body:        params.body ?? null,
      href:        params.href ?? null,
      entity_type: params.entity_type ?? null,
      entity_id:   params.entity_id ?? null,
      target_role: params.target_role ?? null,
      user_id:     params.user_id ?? null,
    });
  } catch (err) {
    console.error("[notifyStaff]", err);
  }
}

export async function notifyStaffRoles(
  roles: UserRole[],
  params: Omit<NotifyStaffParams, "target_role" | "user_id">
): Promise<void> {
  await Promise.all(roles.map((target_role) => notifyStaff({ ...params, target_role })));
}

async function requireNotificationsAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role, is_active").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || (profile as any).is_active === false || !can(role, "notifications", "view")) {
    throw new Error("Insufficient permissions");
  }
  return { user, role };
}

export async function listStaffNotifications(limit = 20): Promise<ActionResult<StaffNotification[]>> {
  try {
    const { user, role } = await requireNotificationsAccess();
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("staff_notifications")
      .select("id, type, title, body, href, entity_type, entity_id, read_at, created_at")
      .or(`user_id.eq.${user.id},target_role.eq.${role}`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { ok: true, data: (data ?? []) as StaffNotification[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load notifications" };
  }
}

export async function getUnreadNotificationCount(): Promise<ActionResult<number>> {
  try {
    const { user, role } = await requireNotificationsAccess();
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { count, error } = await db
      .from("staff_notifications")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .or(`user_id.eq.${user.id},target_role.eq.${role}`);

    if (error) throw error;
    return { ok: true, data: count ?? 0 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to count notifications" };
  }
}

export async function markNotificationRead(id: string): Promise<ActionResult<void>> {
  try {
    await requireNotificationsAccess();
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("staff_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/admin");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to mark read" };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult<void>> {
  try {
    const { user, role } = await requireNotificationsAccess();
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { error } = await db
      .from("staff_notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null)
      .or(`user_id.eq.${user.id},target_role.eq.${role}`);

    if (error) throw error;
    revalidatePath("/admin");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to mark all read" };
  }
}
