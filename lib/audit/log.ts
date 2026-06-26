import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { formatAuditLine, hrefForAudit, notifyRolesForEntity } from "@/lib/audit/activity-feed";
import { notifyStaffRoles } from "@/lib/actions/staff-notifications";
import type { StaffNotificationType } from "@/lib/actions/staff-notifications";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type AuditParams = {
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string | null;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  note?: string | null;
  /** Also push to staff notification inbox (default true) */
  notify?: boolean;
};

function notificationTypeForEntity(entityType: string): StaffNotificationType {
  if (entityType === "application") return "application_submitted";
  if (entityType === "faculty_application") return "faculty_application";
  if (entityType === "contact_enquiry") return "contact_enquiry";
  if (entityType === "news_event") return "content_draft";
  return "system";
}

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
  if (error) {
    console.error("[audit]", error.message);
    return;
  }

  if (params.notify === false) return;

  const title = formatAuditLine({
    entity_type: params.entity_type,
    action:      params.action,
    note:        params.note ?? null,
    new_value:   params.new_value,
  });

  const href = hrefForAudit(params.entity_type, params.entity_id);
  const roles = notifyRolesForEntity(params.entity_type);

  void notifyStaffRoles(roles, {
    type:        notificationTypeForEntity(params.entity_type),
    title,
    body:        params.note ?? undefined,
    href:        href ?? undefined,
    entity_type: params.entity_type,
    entity_id:   params.entity_id,
  });
}
