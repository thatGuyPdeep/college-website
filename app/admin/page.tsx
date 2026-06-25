import Link from "next/link";
import { requirePermission, getUserProfile } from "@/lib/auth/helpers";
import { getAdminDashboard } from "@/lib/actions/admin-dashboard";
import { getNextPendingApplication } from "@/lib/actions/admin-admissions";
import { listStaffNotifications } from "@/lib/actions/staff-notifications";
import { navItemsForRole } from "@/lib/admin/nav";
import { UniversityBanner } from "@/components/admin/UniversityBanner";
import { DashboardWelcome } from "@/components/admin/DashboardWelcome";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";
import type { LucideIcon } from "lucide-react";
import {
  FileCheck,
  Briefcase,
  Mail,
  CreditCard,
  FileText,
  GraduationCap,
  ClipboardList,
  BookOpen,
  Shield,
  Bell,
  ArrowRight,
  Activity,
} from "lucide-react";

const GROUP_LABELS: Record<string, string> = {
  admissions: "Admissions",
  recruitment: "Recruitment",
  contact: "Contact & Grievance",
  payments: "Payments",
  content: "Content",
  erp: "Student ERP",
  examination: "Examination",
  iqac: "IQAC",
  compliance: "Compliance",
};

const GROUP_ICONS: Record<string, LucideIcon> = {
  admissions: FileCheck,
  recruitment: Briefcase,
  contact: Mail,
  payments: CreditCard,
  content: FileText,
  erp: GraduationCap,
  examination: ClipboardList,
  iqac: BookOpen,
  compliance: Shield,
};

export default async function AdminDashboardPage() {
  await requirePermission("dashboard", "view");
  const profile = await getUserProfile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fullName = (profile as any)?.full_name as string | null;

  const [result, nextApp, notifRes] = await Promise.all([
    getAdminDashboard(role),
    can(role, "admissions", "edit") ? getNextPendingApplication() : Promise.resolve({ ok: true as const, data: null }),
    listStaffNotifications(8),
  ]);

  const data = result.ok ? result.data : { widgets: [], recentActivity: [], role };
  const notifications = notifRes.ok ? notifRes.data : [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const quickLinks = navItemsForRole(role).filter((n) => n.href !== "/admin" && n.href !== "/admin/notifications");

  const widgetsByGroup = data.widgets.reduce<Record<string, typeof data.widgets>>((acc, w) => {
    (acc[w.group] ??= []).push(w);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardWelcome
        role={role}
        fullName={fullName}
        nextApplication={nextApp.ok ? nextApp.data : null}
        canReview={can(role, "admissions", "edit")}
        canPublish={can(role, "content", "edit")}
      />

      <UniversityBanner />

      {Object.entries(widgetsByGroup).map(([group, widgets]) => (
        <section key={group} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-bold text-[#0D2660] uppercase tracking-wide">
              {GROUP_LABELS[group] ?? group}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {widgets.map((w) => (
              <AdminStatCard
                key={w.label}
                label={w.label}
                value={w.value}
                href={w.href}
                group={group}
                icon={GROUP_ICONS[group] ?? Activity}
              />
            ))}
          </div>
        </section>
      ))}

      {data.widgets.length === 0 && (
        <AdminPanel title="Getting started" description="Use the sidebar to open your modules">
          <p className="text-sm text-gray-500">
            Your role does not have KPI widgets on the home screen yet. Navigate using the grouped menu on the left.
          </p>
        </AdminPanel>
      )}

      <div className="grid lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-3">
          <AdminPanel
            title="Notifications"
            description={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            action={
              <Link
                href="/admin/notifications"
                className="text-xs font-medium text-[#C8201A] hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-10 w-10 text-blue-200 mb-3" aria-hidden="true" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">New applications and messages will appear here</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href ?? "/admin/notifications"}
                      className={`flex gap-3 p-3 rounded-xl border transition-all hover:border-[#0D2660]/30 hover:shadow-sm ${
                        !n.read_at ? "bg-amber-50/60 border-amber-100" : "border-gray-100 bg-gray-50/50"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read_at ? "bg-[#C8201A]" : "bg-gray-300"}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                        {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>

        <div className="lg:col-span-2">
          <AdminPanel title="Quick access" description="Jump to your modules">
            <div className="grid gap-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#0D2660]/20 hover:shadow-sm transition-all group"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D2660]/5 text-[#0D2660] group-hover:bg-[#C8201A] group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#0D2660]">{item.label}</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-[#C8201A]" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </AdminPanel>
        </div>

        {data.recentActivity.length > 0 && (
          <div className="lg:col-span-5">
            <AdminPanel title="Recent activity" description="Latest actions in the system">
              <ul className="divide-y divide-gray-100">
                {data.recentActivity.map((item, i) => (
                  <li key={i} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C8201A]/10 text-[#C8201A] text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 capitalize">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(item.at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </AdminPanel>
          </div>
        )}
      </div>
    </div>
  );
}
