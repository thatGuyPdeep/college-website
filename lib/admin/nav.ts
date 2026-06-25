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
  ClipboardList,
  Shield,
  Bell,
  BookOpen,
} from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";
import { STAFF_ROLES } from "@/lib/auth/roles";
import { can, type AdminModule } from "@/lib/auth/permissions";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  module: AdminModule;
  exact?: boolean;
};

const NAV_DEFS: Omit<AdminNavItem, "roles">[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, module: "dashboard", exact: true },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, module: "notifications" },
  { label: "Admissions", href: "/admin/admissions", icon: FileCheck, module: "admissions" },
  { label: "Recruitment", href: "/admin/recruitment", icon: Briefcase, module: "recruitment" },
  { label: "Contact", href: "/admin/contact", icon: Mail, module: "contact" },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, module: "payments" },
  { label: "Content", href: "/admin/content", icon: FileText, module: "content" },
  { label: "Examination", href: "/admin/examination", icon: ClipboardList, module: "examination" },
  { label: "IQAC", href: "/admin/iqac", icon: BookOpen, module: "iqac" },
  { label: "ERP Console", href: "/admin/erp", icon: GraduationCap, module: "erp" },
  { label: "Compliance", href: "/admin/compliance", icon: Shield, module: "compliance" },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText, module: "audit" },
  { label: "AI Analytics", href: "/admin/ai", icon: Bot, module: "ai" },
  { label: "Users", href: "/admin/users", icon: Users, module: "users" },
  { label: "Settings", href: "/admin/settings", icon: Settings, module: "settings" },
];

export type AdminNavItemWithRoles = AdminNavItem & { roles: UserRole[] };

/** @deprecated use navItemsForRole */
export const ADMIN_NAV: AdminNavItemWithRoles[] = NAV_DEFS.map((item) => ({
  ...item,
  roles: STAFF_ROLES.filter((r) => can(r, item.module, "view")),
}));

export function navItemsForRole(role: UserRole): AdminNavItem[] {
  return NAV_DEFS.filter((item) => can(role, item.module, "view"));
}

export const ADMIN_LAYOUT_ROLES: UserRole[] = STAFF_ROLES;
