import type { UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

export type ActivityFeedItem = {
  id: string;
  text: string;
  at: string;
  entity_type: string;
  entity_id: string;
  action: string;
  href: string | null;
};

/** Which entity types each role may see in the activity feed */
const ENTITY_VISIBILITY: Record<string, UserRole[]> = {
  application:         ["admissions_staff", "hod", "principal", "admin", "super_admin"],
  faculty_application: ["hr_staff", "admin", "super_admin"],
  profile:             ["admin", "super_admin"],
  staff_invite:        ["super_admin"],
  news_event:          ["content_editor", "admin", "super_admin"],
  contact_enquiry:     ["admissions_staff", "admin", "super_admin", "principal"],
  iqac_document:       ["iqac_coordinator", "admin", "super_admin", "principal"],
  payment:             ["admissions_staff", "accounts_staff", "admin", "super_admin"],
};

export function canViewEntityType(role: UserRole, entityType: string): boolean {
  if (["admin", "super_admin"].includes(role)) return true;
  if (can(role, "audit", "view") && role === "principal") return true;
  const allowed = ENTITY_VISIBILITY[entityType];
  if (!allowed) return can(role, "audit", "view");
  return allowed.includes(role);
}

export function hrefForAudit(entityType: string, entityId: string): string | null {
  switch (entityType) {
    case "application":
      return `/admin/admissions/${entityId}`;
    case "faculty_application":
      return `/admin/recruitment`;
    case "news_event":
      return `/admin/content`;
    case "profile":
      return `/admin/users`;
    case "contact_enquiry":
      return `/admin/contact`;
    default:
      return null;
  }
}

export function formatAuditLine(row: {
  entity_type: string;
  action: string;
  note: string | null;
  new_value?: Record<string, unknown> | null;
}): string {
  const action = row.action.replace(/_/g, " ");
  const extra = row.note
    ? `: ${row.note}`
    : row.new_value?.status
      ? ` → ${String(row.new_value.status)}`
      : row.new_value?.role
        ? ` → ${String(row.new_value.role)}`
        : "";
  return `${row.entity_type.replace(/_/g, " ")} ${action}${extra}`;
}

export function notifyRolesForEntity(entityType: string): UserRole[] {
  if (entityType === "application") {
    return ["admissions_staff", "hod", "principal", "admin", "super_admin"];
  }
  if (entityType === "faculty_application") {
    return ["hr_staff", "admin", "super_admin"];
  }
  if (entityType === "news_event") {
    return ["content_editor", "examination_staff", "iqac_coordinator", "admin", "super_admin"];
  }
  if (entityType === "profile" || entityType === "staff_invite") {
    return ["super_admin", "admin"];
  }
  if (entityType === "contact_enquiry") {
    return ["admissions_staff", "principal", "admin", "super_admin"];
  }
  if (entityType === "payment") {
    return ["admissions_staff", "accounts_staff", "admin", "super_admin"];
  }
  return ["admin", "super_admin"];
}
