"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import type { ActionResult } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireAuditReader() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role;
  if (!profile || !["admin", "super_admin", "admissions_staff"].includes(role)) {
    throw new Error("Insufficient permissions");
  }
}

export type AuditLogRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string | null;
  old_value: unknown;
  new_value: unknown;
  note: string | null;
  created_at: string;
};

export async function listAuditLogs(limit = 100): Promise<ActionResult<AuditLogRow[]>> {
  try {
    await requireAuditReader();
    const { data, error } = await admin
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { ok: true, data: (data ?? []) as AuditLogRow[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load audit log" };
  }
}

export async function listAuditLogsForAdmin(): Promise<ActionResult<AuditLogRow[]>> {
  if (!ADMIN_ROLES.length) return listAuditLogs();
  return listAuditLogs();
}
