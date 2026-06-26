import Link from "next/link";
import type { UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import {
  FileCheck,
  Briefcase,
  ClipboardList,
  CreditCard,
  Shield,
  GraduationCap,
  Download,
  ListTodo,
} from "lucide-react";

type QuickAction = {
  label: string;
  href: string;
  icon: typeof FileCheck;
  description?: string;
};

export function DashboardQuickActions({ role }: { role: UserRole }) {
  const actions: QuickAction[] = [];

  if (can(role, "admissions", "edit")) {
    actions.push({
      label:       "Review applications",
      href:        "/admin/admissions?status=submitted",
      icon:        FileCheck,
      description: "Pending submissions",
    });
    actions.push({
      label: "Seat matrix",
      href:  "/admin/admissions/seats",
      icon:  FileCheck,
    });
  }

  if (can(role, "recruitment", "edit")) {
    actions.push({
      label: "Recruitment queue",
      href:  "/admin/recruitment?status=submitted",
      icon:  Briefcase,
    });
  }

  if (can(role, "examination", "edit")) {
    actions.push({
      label: "Publish exam notice",
      href:  "/admin/examination",
      icon:  ClipboardList,
    });
  }

  if (can(role, "payments", "view")) {
    actions.push({
      label: "Payment reconciliation",
      href:  "/admin/payments",
      icon:  CreditCard,
    });
  }

  if (can(role, "compliance", "view")) {
    actions.push({
      label: "Compliance hub",
      href:  "/admin/compliance",
      icon:  Shield,
    });
    actions.push({
      label:       "Executive report",
      href:        "/api/admin/reports/executive",
      icon:        Download,
      description: "Download CSV summary",
    });
  }

  if (can(role, "erp", "edit")) {
    actions.push({
      label: "ERP console",
      href:  "/admin/erp",
      icon:  GraduationCap,
    });
  }

  if (can(role, "tasks", "view")) {
    actions.push({
      label: "Staff tasks",
      href:  "/admin/tasks",
      icon:  ListTodo,
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-[#0D2660] mb-3">Quick actions</h3>
      <div className="grid gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isDownload = action.href.startsWith("/api/");
          return (
            <Link
              key={action.label}
              href={action.href}
              {...(isDownload ? { download: true } : {})}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-[#0D2660]/20 hover:bg-blue-50/40 transition-all group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D2660]/5 text-[#0D2660] group-hover:bg-[#C8201A] group-hover:text-white transition-colors">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="text-sm font-medium text-gray-800 block">{action.label}</span>
                {action.description && (
                  <span className="text-[10px] text-gray-400">{action.description}</span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
