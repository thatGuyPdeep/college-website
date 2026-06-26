"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";
import { canViewEntityType, formatAuditLine } from "@/lib/audit/activity-feed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireAuditAccess(exporting = false) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  const action = exporting ? "export" : "view";
  if (!profile || !can(role, "audit", action)) {
    throw new Error("Insufficient permissions");
  }
  return { user, role };
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

export async function listAuditLogs(limit = 150): Promise<ActionResult<AuditLogRow[]>> {
  try {
    const { role } = await requireAuditAccess();
    const { data, error } = await admin
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Math.min(limit, 500));
    if (error) throw error;

    const rows = (data ?? []).filter((row: { entity_type: string }) =>
      canViewEntityType(role, row.entity_type),
    );

    return { ok: true, data: rows as AuditLogRow[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load audit log" };
  }
}

export async function exportAuditLogsCsv(): Promise<ActionResult<string>> {
  try {
    const { role } = await requireAuditAccess(true);
    const result = await listAuditLogs(2000);
    if (!result.ok) throw new Error(result.error);

    const header = "Time,Entity Type,Entity ID,Action,Summary,Note\n";
    const rows = result.data.map((log) => {
      const summary = formatAuditLine({
        entity_type: log.entity_type,
        action:      log.action,
        note:        log.note,
        new_value:   log.new_value as Record<string, unknown> | null,
      });
      const cols = [
        new Date(log.created_at).toISOString(),
        log.entity_type,
        log.entity_id,
        log.action,
        summary,
        log.note ?? "",
      ];
      return cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
    });

    return { ok: true, data: header + rows.join("\n") };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Export failed" };
  }
}
