import type { UserRole } from "@/lib/supabase/types";
import { isDashboardStaff } from "@/lib/auth/permissions";

export const STAFF_ROLES: UserRole[] = [
  "admissions_staff",
  "examination_staff",
  "hr_staff",
  "content_editor",
  "accounts_staff",
  "iqac_coordinator",
  "principal",
  "hod",
  "faculty",
  "admin",
  "super_admin",
];

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

export const ERP_ROLES: UserRole[] = ["student", "faculty", "hod", "admin", "super_admin"];

export const ERP_ADMIN_ROLES: UserRole[] = ["faculty", "hod", "admin", "super_admin"];

export const MFA_REQUIRED_ROLES: UserRole[] = ["admin", "super_admin"];

export function isStaffRole(role: UserRole): boolean {
  return isDashboardStaff(role);
}
