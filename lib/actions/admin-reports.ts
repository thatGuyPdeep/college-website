import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import { getAdmissionsScopeFilter } from "@/lib/auth/scopes";
import type { DashboardWidget } from "@/lib/admin/dashboard-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type ExecutiveSummary = {
  generatedAt: string;
  admissions: {
    total: number;
    submitted: number;
    under_review: number;
    approved: number;
    rejected: number;
    waitlisted: number;
  };
  payments: { paid: number; pending: number; failed: number; revenue: number };
  recruitment: { openVacancies: number; applications: number; shortlisted: number };
  contact: { total: number; unread: number; grievances: number };
  erp: { students: number; pendingFees: number };
};

export async function getExecutiveSummary(): Promise<ActionResult<ExecutiveSummary>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Not authenticated");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (profile as any)?.role as UserRole;
    if (!can(role, "compliance", "view") && !can(role, "admissions", "export")) {
      throw new Error("Insufficient permissions");
    }

    const [
      appsRes,
      paymentsRes,
      vacRes,
      facAppsRes,
      contactRes,
      studentsRes,
      feesRes,
    ] = await Promise.all([
      admin.from("applications").select("status"),
      admin.from("payments").select("status, amount"),
      admin.from("vacancies").select("id").eq("status", "open"),
      admin.from("faculty_applications").select("status"),
      admin.from("contact_enquiries").select("status, subject, message"),
      admin.from("student_enrolments").select("id", { count: "exact", head: true }).eq("is_active", true),
      admin.from("student_fee_records").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    const apps = appsRes.data ?? [];
    const payments = paymentsRes.data ?? [];
    const paid = payments.filter((p: { status: string }) => p.status === "paid");
    const facApps = facAppsRes.data ?? [];
    const contacts = contactRes.data ?? [];

    return {
      ok: true,
      data: {
        generatedAt: new Date().toISOString(),
        admissions: {
          total:        apps.length,
          submitted:    apps.filter((a: { status: string }) => a.status === "submitted").length,
          under_review: apps.filter((a: { status: string }) => a.status === "under_review").length,
          approved:     apps.filter((a: { status: string }) => a.status === "approved").length,
          rejected:     apps.filter((a: { status: string }) => a.status === "rejected").length,
          waitlisted:   apps.filter((a: { status: string }) => a.status === "waitlisted").length,
        },
        payments: {
          paid:     paid.length,
          pending:  payments.filter((p: { status: string }) => p.status === "created").length,
          failed:   payments.filter((p: { status: string }) => p.status === "failed").length,
          revenue:  paid.reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0),
        },
        recruitment: {
          openVacancies: vacRes.data?.length ?? 0,
          applications:  facApps.length,
          shortlisted:   facApps.filter((a: { status: string }) =>
            ["shortlisted", "interview", "accepted"].includes(a.status),
          ).length,
        },
        contact: {
          total:      contacts.length,
          unread:     contacts.filter((c: { status: string }) => c.status === "new").length,
          grievances: contacts.filter((c: { subject: string; message: string }) =>
            /grievance|ragging|icc/i.test(`${c.subject} ${c.message}`),
          ).length,
        },
        erp: {
          students:    studentsRes.count ?? 0,
          pendingFees: feesRes.count ?? 0,
        },
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to build summary" };
  }
}

export async function exportExecutiveSummaryCsv(): Promise<ActionResult<string>> {
  const result = await getExecutiveSummary();
  if (!result.ok) return result;

  const s = result.data;
  const lines = [
    "Ramakrishna Mission Vivekananda College — Executive Dashboard Summary",
    `Generated,${s.generatedAt}`,
    "",
    "Admissions",
    `Total,${s.admissions.total}`,
    `Submitted,${s.admissions.submitted}`,
    `Under Review,${s.admissions.under_review}`,
    `Approved,${s.admissions.approved}`,
    `Rejected,${s.admissions.rejected}`,
    `Waitlisted,${s.admissions.waitlisted}`,
    "",
    "Payments",
    `Paid,${s.payments.paid}`,
    `Pending,${s.payments.pending}`,
    `Failed,${s.payments.failed}`,
    `Revenue (INR),${s.payments.revenue}`,
    "",
    "Recruitment",
    `Open Vacancies,${s.recruitment.openVacancies}`,
    `Applications,${s.recruitment.applications}`,
    `Shortlisted+,${s.recruitment.shortlisted}`,
    "",
    "Contact & Compliance",
    `Total Enquiries,${s.contact.total}`,
    `Unread,${s.contact.unread}`,
    `Grievance/Ragging,${s.contact.grievances}`,
    "",
    "ERP",
    `Enrolled Students,${s.erp.students}`,
    `Pending Fee Records,${s.erp.pendingFees}`,
  ];

  return { ok: true, data: lines.join("\n") };
}

/** Scoped application statuses for HOD dashboard widgets */
export async function getScopedApplicationStatuses(
  userId: string,
  role: UserRole,
): Promise<{ status: string }[]> {
  const scope = await getAdmissionsScopeFilter(userId, role);
  let query = admin.from("applications").select("status");
  if (scope.programIds !== null) {
    if (scope.programIds.length === 0) return [];
    query = query.in("program_id", scope.programIds);
  }
  const { data } = await query;
  return data ?? [];
}

export async function getDashboardExtras(
  userId: string,
  role: UserRole,
): Promise<{
  openTasks: number;
  unreadNotifications: number;
  draftNotices: number;
  scheduledNotices: number;
  extraWidgets: DashboardWidget[];
}> {
  const extraWidgets: DashboardWidget[] = [];

  const taskQuery = can(role, "tasks", "edit")
    ? admin.from("staff_tasks").select("id", { count: "exact", head: true }).is("completed_at", null)
    : admin.from("staff_tasks").select("id", { count: "exact", head: true }).eq("assigned_to", userId).is("completed_at", null);

  const [tasksRes, notifRes, draftsRes, scheduledRes, complianceRes] = await Promise.all([
    can(role, "tasks", "view") ? taskQuery : Promise.resolve({ count: 0 }),
    can(role, "notifications", "view")
      ? admin.from("staff_notifications").select("id", { count: "exact", head: true }).is("read_at", null)
          .or(`user_id.eq.${userId},target_role.eq.${role}`)
      : Promise.resolve({ count: 0 }),
    can(role, "content", "view")
      ? admin.from("news_events").select("id", { count: "exact", head: true }).eq("is_published", false)
      : Promise.resolve({ count: 0 }),
    can(role, "examination", "view")
      ? admin.from("news_events").select("id", { count: "exact", head: true })
          .eq("is_published", false).not("scheduled_publish_at", "is", null)
      : Promise.resolve({ count: 0 }),
    can(role, "compliance", "view")
      ? admin.from("contact_enquiries").select("subject, message, status")
      : Promise.resolve({ data: [] }),
  ]);

  const openTasks = tasksRes.count ?? 0;
  const unreadNotifications = notifRes.count ?? 0;
  const draftNotices = draftsRes.count ?? 0;
  const scheduledNotices = scheduledRes.count ?? 0;

  if (can(role, "tasks", "view") && openTasks > 0) {
    extraWidgets.push({
      label: "Open Tasks",
      value: String(openTasks),
      href: "/admin/tasks",
      color: "text-indigo-700 bg-indigo-100",
      group: "compliance",
    });
  }

  if (can(role, "notifications", "view") && unreadNotifications > 0) {
    extraWidgets.push({
      label: "Unread Alerts",
      value: String(unreadNotifications),
      href: "/admin/notifications",
      color: "text-amber-700 bg-amber-100",
      group: "compliance",
    });
  }

  if (can(role, "content", "edit") && draftNotices > 0) {
    extraWidgets.push({
      label: "Draft Notices",
      value: String(draftNotices),
      href: "/admin/content",
      color: "text-gray-700 bg-gray-100",
      group: "content",
    });
  }

  if (can(role, "examination", "edit") && scheduledNotices > 0) {
    extraWidgets.push({
      label: "Scheduled Exam Notices",
      value: String(scheduledNotices),
      href: "/admin/examination",
      color: "text-purple-700 bg-purple-100",
      group: "examination",
    });
  }

  if (can(role, "compliance", "view")) {
    const list = complianceRes.data ?? [];
    const grievances = list.filter((e: { subject: string; message: string }) =>
      /grievance|ragging|icc|anti-ragging/i.test(`${e.subject} ${e.message}`),
    ).length;
    const unread = list.filter((e: { status: string }) => e.status === "new").length;
    extraWidgets.push(
      {
        label: "Compliance Queue",
        value: String(grievances),
        href: "/admin/compliance",
        color: "text-red-700 bg-red-100",
        group: "compliance",
      },
      {
        label: "Unread Enquiries",
        value: String(unread),
        href: "/admin/contact?status=new",
        color: "text-amber-700 bg-amber-100",
        group: "compliance",
      },
    );
  }

  return { openTasks, unreadNotifications, draftNotices, scheduledNotices, extraWidgets };
}
