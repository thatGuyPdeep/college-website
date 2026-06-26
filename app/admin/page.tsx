import Link from "next/link";
import { requirePermission, getUserProfile } from "@/lib/auth/helpers";
import { getAdminDashboard } from "@/lib/actions/admin-dashboard";
import { getNextPendingApplication } from "@/lib/actions/admin-admissions";
import { listActivityFeed } from "@/lib/actions/admin-activity-feed";
import { navItemsForRole } from "@/lib/admin/nav";
import { UniversityBanner } from "@/components/admin/UniversityBanner";
import { DashboardWelcome } from "@/components/admin/DashboardWelcome";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { DashboardNotificationsPanel } from "@/components/admin/DashboardNotificationsPanel";
import { DashboardTasksPanel } from "@/components/admin/DashboardTasksPanel";
import { DashboardQuickActions } from "@/components/admin/DashboardQuickActions";
import { DashboardWidgetPrefs } from "@/components/admin/DashboardWidgetPrefs";
import { getDashboardPrefs } from "@/lib/actions/dashboard-prefs";
import { applyDashboardPrefs } from "@/lib/admin/dashboard-widget-order";
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
  compliance: "Executive & Compliance",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (profile as any)?.id as string;

  const [result, nextApp, feedRes, prefs] = await Promise.all([
    getAdminDashboard(role, userId),
    can(role, "admissions", "edit") ? getNextPendingApplication() : Promise.resolve({ ok: true as const, data: null }),
    listActivityFeed(12),
    getDashboardPrefs(userId),
  ]);

  const data = result.ok ? result.data : { widgets: [], role, openTasks: 0, unreadNotifications: 0 };
  const activityFeed = feedRes.ok ? feedRes.data : [];
  const quickLinks = navItemsForRole(role).filter(
    (n) => !["/admin", "/admin/notifications", "/admin/search", "/admin/tasks"].includes(n.href),
  );

  const widgetsByGroup = applyDashboardPrefs(data.widgets, prefs);
  const availableGroups = [...new Set(data.widgets.map((w) => w.group))];

  const showTasks = can(role, "tasks", "view");
  const showNotifications = can(role, "notifications", "view");

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardWelcome
        role={role}
        fullName={fullName}
        nextApplication={nextApp.ok ? nextApp.data : null}
        unreadNotifications={data.unreadNotifications}
        openTasks={data.openTasks}
      />

      <UniversityBanner />

      {data.widgets.length > 0 && (
        <DashboardWidgetPrefs prefs={prefs} availableGroups={availableGroups} />
      )}

      {widgetsByGroup.map(({ group, widgets }) => (
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
                key={`${group}-${w.label}`}
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

      <div className="grid lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-7">
          <AdminPanel
            title="Activity feed"
            description="Recent actions relevant to your role"
            action={
              <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                <Activity className="h-3 w-3" aria-hidden="true" />
                Audit log
              </span>
            }
          >
            {activityFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-10 w-10 text-blue-200 mb-3" aria-hidden="true" />
                <p className="text-sm text-gray-500">No recent activity yet</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {activityFeed.map((item) => (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-[#0D2660]/30 hover:shadow-sm transition-all"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D2660]/10 text-[#0D2660]">
                          <Activity className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 capitalize">{item.text}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(item.at).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D2660]/10 text-[#0D2660]">
                          <Activity className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 capitalize">{item.text}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(item.at).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>

        <div className="lg:col-span-5 space-y-4">
          {showNotifications && <DashboardNotificationsPanel />}
          {showTasks && <DashboardTasksPanel />}
          <DashboardQuickActions role={role} />
          <AdminPanel title="Modules" description="Sidebar shortcuts">
            <div className="grid gap-2">
              {quickLinks.slice(0, 8).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-[#0D2660]/20 hover:bg-blue-50/40 transition-all group"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D2660]/5 text-[#0D2660] group-hover:bg-[#C8201A] group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-300" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}
