"use server";

import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

export type DashboardWidget = {
  label: string;
  value: string;
  href: string;
  color: string;
  group: "admissions" | "recruitment" | "contact" | "payments" | "content" | "erp" | "examination" | "iqac" | "compliance";
};

export type AdminDashboardData = {
  widgets: DashboardWidget[];
  recentActivity: { text: string; at: string }[];
  role: UserRole;
};

export async function getAdminDashboard(role: UserRole): Promise<ActionResult<AdminDashboardData>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = _adminClient as any;
    const widgets: DashboardWidget[] = [];

    const queries: Promise<void>[] = [];

    if (can(role, "admissions", "view")) {
      queries.push(
        db.from("applications").select("status").then(({ data }: { data: { status: string }[] | null }) => {
          const list = data ?? [];
          widgets.push(
            { label: "Total Applications", value: String(list.length), href: "/admin/admissions", color: "text-blue-700 bg-blue-100", group: "admissions" },
            {
              label: "Pending Review",
              value: String(list.filter((a) => ["submitted", "under_review"].includes(a.status)).length),
              href: "/admin/admissions?status=submitted",
              color: "text-amber-700 bg-amber-100",
              group: "admissions",
            },
            {
              label: "Approved",
              value: String(list.filter((a) => a.status === "approved").length),
              href: "/admin/admissions?status=approved",
              color: "text-green-700 bg-green-100",
              group: "admissions",
            },
          );
        }),
      );
    }

    if (can(role, "recruitment", "view")) {
      queries.push(
        Promise.all([
          db.from("vacancies").select("id").eq("status", "open"),
          db.from("faculty_applications").select("status"),
        ]).then(([vacRes, appRes]: [{ data: unknown[] | null }, { data: { status: string }[] | null }]) => {
          const apps = appRes.data ?? [];
          widgets.push(
            { label: "Open Vacancies", value: String(vacRes.data?.length ?? 0), href: "/admin/recruitment", color: "text-purple-700 bg-purple-100", group: "recruitment" },
            { label: "Applications", value: String(apps.length), href: "/admin/recruitment", color: "text-blue-700 bg-blue-100", group: "recruitment" },
            {
              label: "Shortlisted",
              value: String(apps.filter((a) => a.status === "shortlisted" || a.status === "interview").length),
              href: "/admin/recruitment?status=shortlisted",
              color: "text-green-700 bg-green-100",
              group: "recruitment",
            },
          );
        }),
      );
    }

    if (can(role, "contact", "view")) {
      queries.push(
        db.from("contact_enquiries").select("status, subject, message").then(
          ({ data }: { data: { status: string; subject: string; message: string }[] | null }) => {
            const list = data ?? [];
            const grievance = list.filter((e) => /grievance|ragging/i.test(`${e.subject} ${e.message}`)).length;
            widgets.push(
              { label: "Contact Enquiries", value: String(list.length), href: "/admin/contact", color: "text-blue-700 bg-blue-100", group: "contact" },
              { label: "Unread Messages", value: String(list.filter((e) => e.status === "new").length), href: "/admin/contact?status=new", color: "text-amber-700 bg-amber-100", group: "contact" },
              { label: "Grievance / Ragging", value: String(grievance), href: "/admin/contact?grievance=1", color: "text-red-700 bg-red-100", group: "contact" },
            );
          },
        ),
      );
    }

    if (can(role, "payments", "view")) {
      queries.push(
        db.from("payments").select("status, amount").then(
          ({ data }: { data: { status: string; amount: number }[] | null }) => {
            const list = data ?? [];
            const paid = list.filter((p) => p.status === "paid");
            const pending = list.filter((p) => p.status === "created");
            const paidTotal = paid.reduce((s, p) => s + Number(p.amount), 0);
            widgets.push(
              { label: "Paid Transactions", value: String(paid.length), href: "/admin/payments", color: "text-green-700 bg-green-100", group: "payments" },
              { label: "Pending Payments", value: String(pending.length), href: "/admin/payments", color: "text-amber-700 bg-amber-100", group: "payments" },
              { label: "Revenue (paid)", value: `₹${paidTotal.toLocaleString("en-IN")}`, href: "/admin/payments", color: "text-emerald-700 bg-emerald-100", group: "payments" },
            );
          },
        ),
      );
    }

    if (can(role, "content", "view")) {
      queries.push(
        Promise.all([
          db.from("news_events").select("id", { count: "exact", head: true }),
          db.from("faculty_members").select("id", { count: "exact", head: true }),
          db.from("leadership_entries").select("id", { count: "exact", head: true }),
        ]).then(([news, faculty, leadership]: [{ count: number | null }, { count: number | null }, { count: number | null }]) => {
          widgets.push(
            { label: "News Items", value: String(news.count ?? 0), href: "/admin/content", color: "text-blue-700 bg-blue-100", group: "content" },
            { label: "Faculty Profiles", value: String(faculty.count ?? 0), href: "/admin/content", color: "text-purple-700 bg-purple-100", group: "content" },
            { label: "Leadership Entries", value: String(leadership.count ?? 0), href: "/admin/content", color: "text-indigo-700 bg-indigo-100", group: "content" },
          );
        }),
      );
    }

    if (can(role, "examination", "view")) {
      queries.push(
        db.from("news_events").select("id, is_published").or("category.eq.examination,category.eq.Examination").then(
          ({ data }: { data: { is_published: boolean }[] | null }) => {
            const list = data ?? [];
            widgets.push(
              { label: "Exam Notices", value: String(list.length), href: "/admin/examination", color: "text-blue-700 bg-blue-100", group: "examination" },
              { label: "Published", value: String(list.filter((n) => n.is_published).length), href: "/admin/examination", color: "text-green-700 bg-green-100", group: "examination" },
            );
          },
        ),
      );
    }

    if (can(role, "iqac", "view")) {
      queries.push(
        db.from("iqac_documents").select("id, is_published").then(
          ({ data }: { data: { is_published: boolean }[] | null }) => {
            const list = data ?? [];
            widgets.push(
              { label: "IQAC Documents", value: String(list.length), href: "/admin/iqac", color: "text-indigo-700 bg-indigo-100", group: "iqac" },
              { label: "Published", value: String(list.filter((d) => d.is_published).length), href: "/admin/iqac", color: "text-green-700 bg-green-100", group: "iqac" },
            );
          },
        ).catch(() => undefined),
      );
    }

    if (can(role, "erp", "view")) {
      queries.push(
        Promise.all([
          db.from("student_enrolments").select("id", { count: "exact", head: true }).eq("is_active", true),
          db.from("assignment_submissions").select("id, grade").limit(200),
          db.from("student_fee_records").select("status").eq("status", "pending"),
        ]).then(([students, subs, fees]: [{ count: number | null }, { data: { grade: string | null }[] | null }, { data: unknown[] | null }]) => {
          const ungraded = (subs.data ?? []).filter((s) => !s.grade).length;
          widgets.push(
            { label: "Enrolled Students", value: String(students.count ?? 0), href: "/admin/erp", color: "text-blue-700 bg-blue-100", group: "erp" },
            { label: "Ungraded Submissions", value: String(ungraded), href: "/admin/erp", color: "text-amber-700 bg-amber-100", group: "erp" },
            { label: "Pending Fees", value: String(fees.data?.length ?? 0), href: "/admin/erp", color: "text-red-700 bg-red-100", group: "erp" },
          );
        }),
      );
    }

    await Promise.all(queries);

    let recentActivity: { text: string; at: string }[] = [];
    if (can(role, "audit", "view")) {
      const { data: audit } = await db
        .from("audit_logs")
        .select("action, note, created_at, entity_type")
        .order("created_at", { ascending: false })
        .limit(8);

      recentActivity = (audit ?? []).map((a: { action: string; note: string | null; created_at: string; entity_type: string }) => ({
        text: `${a.entity_type} ${a.action.replace(/_/g, " ")}${a.note ? `: ${a.note}` : ""}`,
        at:   a.created_at,
      }));
    }

    return { ok: true, data: { widgets, recentActivity, role } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load dashboard" };
  }
}
