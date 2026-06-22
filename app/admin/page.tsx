import Link from "next/link";
import { requireRole, getUserProfile } from "@/lib/auth/helpers";
import { getAdminDashboard } from "@/lib/actions/admin-dashboard";
import { navItemsForRole } from "@/lib/admin/nav";
import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/lib/supabase/types";

const GROUP_LABELS: Record<string, string> = {
  admissions: "Admissions",
  recruitment: "Recruitment",
  contact: "Contact & Grievance",
  payments: "Payments",
  content: "Content",
  erp: "Student ERP",
};

export default async function AdminDashboardPage() {
  await requireRole(["admissions_staff", "hr_staff", "content_editor", "admin", "super_admin"]);
  const profile = await getUserProfile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;

  const result = await getAdminDashboard(role);
  const data = result.ok
    ? result.data
    : { widgets: [], recentActivity: [], role };

  const quickLinks = navItemsForRole(role).filter((n) => n.href !== "/admin");

  const widgetsByGroup = data.widgets.reduce<Record<string, typeof data.widgets>>((acc, w) => {
    (acc[w.group] ??= []).push(w);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8 capitalize">Signed in as {role.replace("_", " ")}</p>

      {Object.entries(widgetsByGroup).map(([group, widgets]) => (
        <section key={group} className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {GROUP_LABELS[group] ?? group}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((w) => (
              <Link key={w.label} href={w.href}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className={`text-2xl font-bold text-gray-900`}>{w.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{w.label}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {data.widgets.length === 0 && (
        <p className="text-sm text-gray-400 mb-8">No dashboard widgets for your role. Use the sidebar to navigate.</p>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 hover:text-[#0D2660] border hover:border-blue-200 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {data.recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400">No activity yet</p>
            ) : (
              <div className="space-y-3 text-sm text-gray-600">
                {data.recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-[#C8201A] mt-1.5 shrink-0" aria-hidden="true" />
                    <div>
                      <span>{item.text}</span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(item.at).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
