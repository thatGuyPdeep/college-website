import { adminClient as _adminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type AuditParams = {
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  note?: string | null;
};

export async function writeAudit(params: AuditParams): Promise<void> {
  const { error } = await admin.from("audit_logs").insert({
    entity_type: params.entity_type,
    entity_id:   params.entity_id,
    action:      params.action,
    actor_id:    params.actor_id,
    old_value:   params.old_value ?? null,
    new_value:   params.new_value ?? null,
    note:        params.note ?? null,
  });
  if (error) console.error("[audit]", error.message);
}
