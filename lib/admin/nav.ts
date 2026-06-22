import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileCheck,
  Briefcase,
  Mail,
  CreditCard,
  ScrollText,
  FileText,
  Settings,
  Bot,
  Users,
  GraduationCap,
} from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";
import { STAFF_ROLES, ERP_ADMIN_ROLES, ADMIN_ROLES } from "@/lib/auth/roles";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  exact?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: STAFF_ROLES, exact: true },
  { label: "Admissions", href: "/admin/admissions", icon: FileCheck, roles: ["admissions_staff", "admin", "super_admin"] },
  { label: "Recruitment", href: "/admin/recruitment", icon: Briefcase, roles: ["hr_staff", "admin", "super_admin"] },
  { label: "Contact", href: "/admin/contact", icon: Mail, roles: ["admissions_staff", "admin", "super_admin"] },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, roles: ["admissions_staff", "admin", "super_admin"] },
  { label: "Content", href: "/admin/content", icon: FileText, roles: ["content_editor", "admin", "super_admin"] },
  { label: "ERP Console", href: "/admin/erp", icon: GraduationCap, roles: ERP_ADMIN_ROLES },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText, roles: ["admissions_staff", "admin", "super_admin"] },
  { label: "AI Analytics", href: "/admin/ai", icon: Bot, roles: ADMIN_ROLES },
  { label: "Users", href: "/admin/users", icon: Users, roles: ADMIN_ROLES },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ADMIN_ROLES },
];

export function navItemsForRole(role: UserRole): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}

export const ADMIN_LAYOUT_ROLES: UserRole[] = [...STAFF_ROLES, "faculty"];
