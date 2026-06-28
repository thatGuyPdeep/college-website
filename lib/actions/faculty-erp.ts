"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { ERP_ADMIN_ROLES } from "@/lib/auth/roles";
import { requirePermission } from "@/lib/auth/helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type FacultyPortalUser = {
  email: string;
  role: string;
  name: string | null;
};

export type SalarySlipRow = {
  id: string;
  month: number;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  filePath: string | null;
};

export type LeaveRequestRow = {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string | null;
  status: string;
  createdAt: string;
};

async function getAuthUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getFacultyPortalAccess() {
  const user = await getAuthUserId();
  if (!user) return { ok: false as const, error: "Not authenticated" };

  const { data: profile } = await admin
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (!role || !ERP_ADMIN_ROLES.includes(role as typeof ERP_ADMIN_ROLES[number])) {
    return { ok: false as const, error: "Faculty access required" };
  }

  return {
    ok: true as const,
    userId: user.id,
    user: {
      email: user.email ?? (profile as { email?: string })?.email ?? "",
      role,
      name: (profile as { full_name?: string } | null)?.full_name ?? null,
    } satisfies FacultyPortalUser,
  };
}

async function ensureLeaveBalance(userId: string) {
  const { data } = await admin.from("hr_leave_balances").select("*").eq("user_id", userId).maybeSingle();
  if (data) {
    return {
      casual: data.casual as number,
      earned: data.earned as number,
      medical: data.medical as number,
    };
  }
  return { casual: 12, earned: 30, medical: 15 };
}

export async function getFacultyPayrollSummary() {
  const access = await getFacultyPortalAccess();
  if (!access.ok) return access;

  const { userId, user } = access;

  try {
    const [slipsRes, balance, leavesRes] = await Promise.all([
      admin
        .from("hr_salary_slips")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "published")
        .order("year", { ascending: false })
        .order("month", { ascending: false })
        .limit(24),
      ensureLeaveBalance(userId),
      admin
        .from("hr_leave_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const salarySlips: SalarySlipRow[] = (slipsRes.data ?? []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      month: s.month as number,
      year: s.year as number,
      grossPay: Number(s.gross_pay),
      deductions: Number(s.deductions),
      netPay: Number(s.net_pay),
      filePath: (s.file_path as string | null) ?? null,
    }));

    const leaveRequests: LeaveRequestRow[] = (leavesRes.data ?? []).map((l: Record<string, unknown>) => ({
      id: l.id as string,
      leaveType: l.leave_type as string,
      fromDate: l.from_date as string,
      toDate: l.to_date as string,
      days: Number(l.days),
      reason: (l.reason as string | null) ?? null,
      status: l.status as string,
      createdAt: l.created_at as string,
    }));

    const payrollNote =
      salarySlips.length === 0
        ? "No salary slips published yet. Contact the accounts office for interim statements."
        : null;

    return {
      ok: true as const,
      user,
      userId,
      salarySlips,
      leaveBalance: balance,
      leaveRequests,
      payrollNote,
    };
  } catch {
    return {
      ok: true as const,
      user,
      userId,
      salarySlips: [] as SalarySlipRow[],
      leaveBalance: { casual: 12, earned: 30, medical: 15 },
      leaveRequests: [] as LeaveRequestRow[],
      payrollNote:
        "HR payroll tables are being set up. Run migration 027_hr_payroll.sql, then contact accounts for salary details.",
    };
  }
}

export async function submitLeaveRequest(formData: FormData) {
  const access = await getFacultyPortalAccess();
  if (!access.ok) return { ok: false as const, error: access.error };

  const leaveType = String(formData.get("leave_type") ?? "");
  const fromDate = String(formData.get("from_date") ?? "");
  const toDate = String(formData.get("to_date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!["casual", "earned", "medical", "other"].includes(leaveType)) {
    return { ok: false as const, error: "Invalid leave type" };
  }
  if (!fromDate || !toDate) {
    return { ok: false as const, error: "Dates are required" };
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (to < from) return { ok: false as const, error: "End date must be on or after start date" };

  const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const { error } = await admin.from("hr_leave_requests").insert({
    user_id: access.userId,
    leave_type: leaveType,
    from_date: fromDate,
    to_date: toDate,
    days,
    reason,
    status: "pending",
  });

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/faculty-portal/leave");
  return { ok: true as const };
}

/** Admin HR — list pending leave + recent slips */
export async function listHrLeaveRequests(status?: string) {
  await requirePermission("recruitment", "view");

  let q = admin
    .from("hr_leave_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return { ok: false as const, error: error.message };

  const rows = data ?? [];
  const userIds = [...new Set(rows.map((r: { user_id: string }) => r.user_id))];
  let profileMap: Record<string, { email?: string; full_name?: string }> = {};

  if (userIds.length) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);
    for (const p of profiles ?? []) {
      profileMap[p.id] = { email: p.email, full_name: p.full_name };
    }
  }

  return {
    ok: true as const,
    data: rows.map((r: Record<string, unknown>) => ({
      ...r,
      profiles: profileMap[r.user_id as string] ?? null,
    })),
  };
}

export async function updateLeaveRequestStatus(requestId: string, status: "approved" | "rejected") {
  await requirePermission("recruitment", "edit");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await admin
    .from("hr_leave_requests")
    .update({
      status,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/hr");
  revalidatePath("/faculty-portal/leave");
  return { ok: true as const };
}

export async function createSalarySlip(formData: FormData) {
  await requirePermission("recruitment", "edit");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));
  const grossPay = Number(formData.get("gross_pay"));
  const deductions = Number(formData.get("deductions") ?? 0);
  const netPay = Number(formData.get("net_pay")) || grossPay - deductions;

  if (!email || !month || !year) {
    return { ok: false as const, error: "Email, month, and year are required" };
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (!profile?.id) return { ok: false as const, error: "No user found with that email" };

  let filePath: string | null = null;
  const pdf = formData.get("pdf") as File | null;
  if (pdf && pdf.size > 0) {
    if (pdf.type !== "application/pdf") {
      return { ok: false as const, error: "Salary slip must be a PDF file" };
    }
    if (pdf.size > 5 * 1024 * 1024) {
      return { ok: false as const, error: "PDF must be under 5 MB" };
    }
    filePath = `${profile.id}/${year}-${String(month).padStart(2, "0")}.pdf`;
    const buffer = Buffer.from(await pdf.arrayBuffer());
    const { error: uploadErr } = await admin.storage
      .from("hr-documents")
      .upload(filePath, buffer, { contentType: "application/pdf", upsert: true });
    if (uploadErr) return { ok: false as const, error: uploadErr.message };
  }

  const { error } = await admin.from("hr_salary_slips").upsert(
    {
      user_id: profile.id,
      month,
      year,
      gross_pay: grossPay,
      deductions,
      net_pay: netPay,
      file_path: filePath,
      status: "published",
    },
    { onConflict: "user_id,month,year" },
  );

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/hr");
  revalidatePath("/faculty-portal/salary-slips");
  return { ok: true as const };
}

export async function setLeaveBalance(formData: FormData) {
  await requirePermission("recruitment", "edit");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const casual = Number(formData.get("casual") ?? 12);
  const earned = Number(formData.get("earned") ?? 30);
  const medical = Number(formData.get("medical") ?? 15);

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (!profile?.id) return { ok: false as const, error: "No user found with that email" };

  const { error } = await admin.from("hr_leave_balances").upsert(
    { user_id: profile.id, casual, earned, medical, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/hr");
  return { ok: true as const };
}

const DAYS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type FacultyTimetableSlot = {
  id: string;
  dayOfWeek: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string | null;
  programName: string | null;
};

export type FacultyClassStudent = {
  userId: string;
  name: string | null;
  rollNumber: string | null;
};

export type FacultyAttendanceSummary = {
  courseCode: string;
  courseName: string;
  date: string;
  present: number;
  absent: number;
  late: number;
};

function facultyDisplayName(user: FacultyPortalUser): string {
  if (user.name?.trim()) return user.name.trim();
  return user.email.split("@")[0] ?? "";
}

function nameMatchesFaculty(facultyName: string | null, displayName: string): boolean {
  if (!facultyName?.trim()) return false;
  const a = facultyName.toLowerCase();
  const b = displayName.toLowerCase();
  return a.includes(b) || b.includes(a) || a.split(" ").some((w) => w.length > 2 && b.includes(w));
}

export async function getFacultyAttendanceData() {
  const access = await getFacultyPortalAccess();
  if (!access.ok) return access;

  const displayName = facultyDisplayName(access.user);

  try {
    const { data: slots } = await admin
      .from("timetable_slots")
      .select("*, programs(name)")
      .order("day_of_week")
      .order("start_time");

    const mySlots: FacultyTimetableSlot[] = (slots ?? [])
      .filter((s: { faculty_name?: string | null }) => nameMatchesFaculty(s.faculty_name ?? null, displayName))
      .map((s: Record<string, unknown>) => ({
        id: s.id as string,
        dayOfWeek: s.day_of_week as number,
        dayLabel: DAYS[s.day_of_week as number] ?? "",
        startTime: String(s.start_time).slice(0, 5),
        endTime: String(s.end_time).slice(0, 5),
        subject: s.subject as string,
        room: (s.room as string | null) ?? null,
        programName: (s.programs as { name?: string } | null)?.name ?? null,
      }));

    const subjects = [...new Set(mySlots.map((s) => s.subject))];
    let summaries: FacultyAttendanceSummary[] = [];

    if (subjects.length) {
      const { data: records } = await admin
        .from("attendance_records")
        .select("course_code, course_name, date, status")
        .in("course_code", subjects)
        .order("date", { ascending: false })
        .limit(100);

      const grouped = new Map<string, FacultyAttendanceSummary>();
      for (const r of records ?? []) {
        const key = `${r.course_code}:${r.date}`;
        const entry = grouped.get(key) ?? {
          courseCode: r.course_code,
          courseName: r.course_name ?? r.course_code,
          date: r.date,
          present: 0,
          absent: 0,
          late: 0,
        };
        if (r.status === "present") entry.present++;
        else if (r.status === "late") entry.late++;
        else entry.absent++;
        grouped.set(key, entry);
      }
      summaries = [...grouped.values()].slice(0, 20);
    }

    return {
      ok: true as const,
      user: access.user,
      displayName,
      timetable: mySlots,
      summaries,
      hasClasses: mySlots.length > 0,
    };
  } catch {
    return {
      ok: true as const,
      user: access.user,
      displayName,
      timetable: [] as FacultyTimetableSlot[],
      summaries: [] as FacultyAttendanceSummary[],
      hasClasses: false,
    };
  }
}

export async function recordFacultyStudentAttendance(formData: FormData) {
  const access = await getFacultyPortalAccess();
  if (!access.ok) return { ok: false as const, error: access.error };

  const userId = String(formData.get("user_id") ?? "");
  const courseCode = String(formData.get("course_code") ?? "").trim();
  const courseName = String(formData.get("course_name") ?? courseCode).trim();
  const date = String(formData.get("date") ?? "");
  const status = String(formData.get("status") ?? "present");

  if (!userId || !courseCode || !date) {
    return { ok: false as const, error: "Missing required fields" };
  }
  if (!["present", "absent", "late"].includes(status)) {
    return { ok: false as const, error: "Invalid status" };
  }

  const displayName = facultyDisplayName(access.user);
  const { data: slots } = await admin
    .from("timetable_slots")
    .select("subject, faculty_name")
    .eq("subject", courseCode);

  const allowed = (slots ?? []).some((s: { faculty_name?: string | null }) =>
    nameMatchesFaculty(s.faculty_name ?? null, displayName),
  );

  if (!allowed && access.user.role === "faculty") {
    return { ok: false as const, error: "You are not assigned to this class in the timetable" };
  }

  const { error } = await admin.from("attendance_records").upsert(
    {
      user_id: userId,
      course_code: courseCode,
      course_name: courseName,
      date,
      status,
    },
    { onConflict: "user_id,course_code,date" },
  );

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/faculty-portal/attendance");
  revalidatePath("/student/attendance");
  return { ok: true as const };
}

export async function listStudentsForFacultyClass(subject: string) {
  const access = await getFacultyPortalAccess();
  if (!access.ok) return access;

  const { data: slot } = await admin
    .from("timetable_slots")
    .select("program_id")
    .eq("subject", subject)
    .limit(1)
    .maybeSingle();

  let q = admin
    .from("student_enrolments")
    .select("user_id, roll_number, profiles(full_name, email)")
    .eq("is_active", true);

  if (slot?.program_id) q = q.eq("program_id", slot.program_id);

  const { data, error } = await q.limit(200);
  if (error) return { ok: false as const, error: error.message };

  return {
    ok: true as const,
    students: (data ?? []).map((r: Record<string, unknown>) => {
      const p = r.profiles as { full_name?: string; email?: string } | null;
      return {
        userId: r.user_id as string,
        name: p?.full_name ?? p?.email ?? null,
        rollNumber: (r.roll_number as string | null) ?? null,
      } satisfies FacultyClassStudent;
    }),
  };
}
