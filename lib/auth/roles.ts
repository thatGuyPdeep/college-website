import type { UserRole } from "@/lib/supabase/types";

export const STAFF_ROLES: UserRole[] = [
  "admissions_staff",
  "hr_staff",
  "content_editor",
  "admin",
  "super_admin",
];

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

export const ERP_ROLES: UserRole[] = ["student", "faculty", "admin", "super_admin"];

export const ERP_ADMIN_ROLES: UserRole[] = ["faculty", "admin", "super_admin"];

export const MFA_REQUIRED_ROLES: UserRole[] = ["admin", "super_admin"];
