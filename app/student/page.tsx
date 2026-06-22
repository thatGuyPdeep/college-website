import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, BookOpen, Calendar, ClipboardList } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getStudentDashboard, getErpPageData } from "@/lib/actions/erp";

export const metadata: Metadata = { title: "Student Portal" };

const DAYS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function StudentPortalPage() {
  const dash = await getStudentDashboard();
  if (!dash.ok) redirect("/login?redirect=/student");

  const erp = await getErpPageData();
  const { user, notices, enrolments } = dash;
  const attendance = erp.ok ? erp.attendance : [];
  const marks      = erp.ok ? erp.marks : [];
  const timetable  = erp.ok ? erp.timetable : [];
  const assignments = erp.ok ? erp.assignments : [];
  const fees = erp.ok ? erp.fees : [];
  const pendingFees = fees.filter((f) => f.status !== "paid");

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendancePct = attendance.length
    ? Math.round((presentCount / attendance.length) * 100)
    : null;

  return (
    <>
      <PageHero
        eyebrow="ERP"
        title="Student Portal"
        description={`Welcome${user.email ? `, ${user.email.split("@")[0]}` : ""}.`}
      />
      <section className="section bg-white pt-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Attendance</p>
              <p className="text-2xl font-bold text-[#0D2660]">
                {attendancePct != null ? `${attendancePct}%` : "—"}
              </p>
              <Link href="/student/attendance" className="text-xs text-[#C8201A] hover:underline">View →</Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Marks entries</p>
              <p className="text-2xl font-bold text-[#0D2660]">{marks.length || "—"}</p>
              <Link href="/student/marks" className="text-xs text-[#C8201A] hover:underline">View →</Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Timetable slots</p>
              <p className="text-2xl font-bold text-[#0D2660]">{timetable.length || "—"}</p>
              <Link href="/student/timetable" className="text-xs text-[#C8201A] hover:underline">View →</Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Assignments</p>
              <p className="text-2xl font-bold text-[#0D2660]">{assignments.length || "—"}</p>
              <Link href="/student/assignments" className="text-xs text-[#C8201A] hover:underline">View →</Link>
            </CardContent>
          </Card>
        </div>

        {fees.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Fee status</h2>
            <ul className="space-y-2">
              {fees.map((f) => (
                <li key={f.id} className="flex flex-wrap justify-between gap-2 border border-blue-100 rounded-lg px-4 py-3 text-sm bg-white">
                  <div>
                    <span className="font-medium capitalize">{f.fee_type}</span>
                    {f.description && <span className="text-gray-500"> — {f.description}</span>}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#0D2660]">
                      ₹{f.amount_paid.toLocaleString("en-IN")} / ₹{f.amount.toLocaleString("en-IN")}
                    </span>
                    <span className={`ml-2 text-xs uppercase ${f.status === "paid" ? "text-green-700" : "text-amber-700"}`}>
                      {f.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {pendingFees.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">Contact the accounts office for fee payment queries.</p>
            )}
          </div>
        )}

        <div className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0D2660] mb-4">
            <BookOpen className="h-5 w-5" /> My Programmes
          </h2>
          {enrolments.length === 0 ? (
            <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-xl p-5">
              No active enrolment on record. Contact admissions after your application is approved.
            </p>
          ) : (
            <div className="grid gap-4">
              {enrolments.map((e) => (
                <Card key={e.id}>
                  <CardContent className="p-5">
                    <p className="font-semibold">{e.programs?.name ?? "Programme"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {e.roll_number && <>Roll: {e.roll_number} · </>}
                      Semester {e.semester ?? 1}
                      {e.academic_year && <> · {e.academic_year}</>}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {timetable.length > 0 && (
          <div className="mb-10">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0D2660] mb-4">
              <Calendar className="h-5 w-5" /> Today&apos;s Schedule
            </h2>
            <ul className="space-y-2 text-sm">
              {timetable.slice(0, 4).map((t) => (
                <li key={t.id} className="flex justify-between border border-blue-50 rounded-lg px-4 py-2">
                  <span>{DAYS[t.day_of_week]} · {t.subject}</span>
                  <span className="text-gray-500">{t.start_time?.slice(0, 5)}–{t.end_time?.slice(0, 5)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0D2660] mb-4">
            <Bell className="h-5 w-5" /> Notices
          </h2>
          <ul className="space-y-3">
            {notices.map((n) => (
              <li key={n.id} className="border border-blue-100 rounded-xl p-5">
                <p className="font-medium">{n.title}</p>
                {n.body && <p className="text-sm text-gray-600 mt-1">{n.body}</p>}
              </li>
            ))}
          </ul>
        </div>

        {assignments.length > 0 && (
          <div className="mt-10">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0D2660] mb-4">
              <ClipboardList className="h-5 w-5" /> Upcoming Assignments
            </h2>
            <ul className="space-y-2 text-sm">
              {assignments.slice(0, 3).map((a) => (
                <li key={a.id} className="border border-blue-50 rounded-lg px-4 py-3">
                  <Link href="/student/assignments" className="font-medium hover:underline">{a.title}</Link>
                  {a.due_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Due {new Date(a.due_at).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
