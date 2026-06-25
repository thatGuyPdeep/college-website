"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { notifyStaff } from "@/lib/actions/staff-notifications";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireTaskManager() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!["admin", "super_admin", "principal"].includes(role)) {
    throw new Error("Insufficient permissions");
  }
  return { user, role };
}

export type StaffTask = {
  id: string;
  title: string;
  assigned_to: string;
  assigned_by: string;
  due_at: string | null;
  completed_at: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  assignee_name?: string | null;
};

export async function listStaffTasks(): Promise<ActionResult<StaffTask[]>> {
  try {
    const { user } = await requireTaskManager();
    const { data, error } = await admin
      .from("staff_tasks")
      .select("id, title, assigned_to, assigned_by, due_at, completed_at, entity_type, entity_id, created_at")
      .or(`assigned_by.eq.${user.id},assigned_to.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return { ok: true, data: (data ?? []) as StaffTask[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load tasks" };
  }
}

export async function createStaffTask(params: {
  title: string;
  assigned_to: string;
  due_at?: string;
  entity_type?: string;
  entity_id?: string;
}): Promise<ActionResult<void>> {
  try {
    const { user } = await requireTaskManager();

    const { error } = await admin.from("staff_tasks").insert({
      title:       params.title,
      assigned_to: params.assigned_to,
      assigned_by: user.id,
      due_at:      params.due_at ?? null,
      entity_type: params.entity_type ?? null,
      entity_id:   params.entity_id ?? null,
    });

    if (error) throw error;

    await notifyStaff({
      type:     "task_assigned",
      title:    `Task assigned: ${params.title}`,
      user_id:  params.assigned_to,
      href:     "/admin",
    });

    revalidatePath("/admin");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create task" };
  }
}

export async function completeStaffTask(taskId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await admin
      .from("staff_tasks")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", taskId)
      .eq("assigned_to", user.id);

    if (error) throw error;
    revalidatePath("/admin");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to complete task" };
  }
}
