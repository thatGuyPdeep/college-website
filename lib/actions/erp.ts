"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { ERP_ROLES } from "@/lib/auth/roles";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type ErpNotice = {
  id: string;
  title: string;
  body: string | null;
  audience: string;
  published_at: string;
};

export type StudentEnrolment = {
  id: string;
  roll_number: string | null;
  semester: number | null;
  academic_year: string | null;
  program_id?: string | null;
  programs?: { name: string; slug: string } | null;
};

export type AttendanceRecord = {
  id: string;
  course_code: string;
  course_name: string | null;
  date: string;
  status: string;
};

export type MarkRecord = {
  id: string;
  subject: string;
  exam_type: string | null;
  marks_obtained: number | null;
  max_marks: number | null;
  semester: number | null;
  academic_year: string | null;
};

export type TimetableSlot = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  room: string | null;
  faculty_name: string | null;
};

export type AssignmentItem = {
  id: string;
  title: string;
  description: string | null;
  due_at: string | null;
};

export type AssignmentSubmission = {
  assignment_id: string;
  submitted_at: string;
  file_path: string | null;
  grade: string | null;
};

export type AssignmentWithSubmission = AssignmentItem & {
  submission: AssignmentSubmission | null;
};

export type FeeRecord = {
  id: string;
  fee_type: string;
  description: string | null;
  amount: number;
  amount_paid: number;
  status: string;
  due_date: string | null;
};

async function requireErpAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (!role || !ERP_ROLES.includes(role as typeof ERP_ROLES[number])) {
    return { ok: false as const, error: "Access denied" };
  }

  return { ok: true as const, user, role };
}

export async function getStudentNotices(): Promise<ErpNotice[]> {
  try {
    const { data, error } = await admin
      .from("erp_notices")
      .select("*")
      .eq("is_published", true)
      .in("audience", ["all", "student"])
      .order("published_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return (data ?? []) as ErpNotice[];
  } catch {
    return [
      {
        id:           "fallback",
        title:        "Student Portal",
        body:         "Run migration 006_erp.sql in Supabase to enable live notices. Exam schedules and attendance will appear here.",
        audience:     "student",
        published_at: new Date().toISOString(),
      },
    ];
  }
}

export async function getStudentEnrolments(userId: string): Promise<StudentEnrolment[]> {
  try {
    const { data, error } = await admin
      .from("student_enrolments")
      .select("*, programs(name, slug)")
      .eq("user_id", userId)
      .eq("is_active", true);
    if (error) throw error;
    return (data ?? []) as StudentEnrolment[];
  } catch {
    return [];
  }
}

export async function getStudentDashboard() {
  const access = await requireErpAccess();
  if (!access.ok) return access;

  const { user } = access;
  const [notices, enrolments] = await Promise.all([
    getStudentNotices(),
    getStudentEnrolments(user.id),
  ]);

  return { ok: true as const, user, notices, enrolments };
}

export async function getStudentAttendance(userId: string): Promise<AttendanceRecord[]> {
  try {
    const { data, error } = await admin
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(60);
    if (error) throw error;
    return (data ?? []) as AttendanceRecord[];
  } catch {
    return [];
  }
}

export async function getStudentMarks(userId: string): Promise<MarkRecord[]> {
  try {
    const { data, error } = await admin
      .from("student_marks")
      .select("*")
      .eq("user_id", userId)
      .order("academic_year", { ascending: false });
    if (error) throw error;
    return (data ?? []) as MarkRecord[];
  } catch {
    return [];
  }
}

export async function getStudentTimetable(programId: string | null): Promise<TimetableSlot[]> {
  if (!programId) return [];
  try {
    const { data, error } = await admin
      .from("timetable_slots")
      .select("*")
      .eq("program_id", programId)
      .order("day_of_week")
      .order("start_time");
    if (error) throw error;
    return (data ?? []) as TimetableSlot[];
  } catch {
    return [];
  }
}

export async function getStudentAssignments(
  programId: string | null,
  userId?: string
): Promise<AssignmentWithSubmission[]> {
  if (!programId) return [];
  try {
    const { data, error } = await admin
      .from("assignments")
      .select("*")
      .eq("program_id", programId)
      .order("due_at", { ascending: true });
    if (error) throw error;

    const assignments = (data ?? []) as AssignmentItem[];
    if (!userId || assignments.length === 0) {
      return assignments.map((a) => ({ ...a, submission: null }));
    }

    const { data: subs } = await admin
      .from("assignment_submissions")
      .select("assignment_id, submitted_at, file_path, grade")
      .eq("user_id", userId)
      .in("assignment_id", assignments.map((a) => a.id));

    const subMap = new Map(
      ((subs ?? []) as AssignmentSubmission[]).map((s) => [s.assignment_id, s])
    );

    return assignments.map((a) => ({
      ...a,
      submission: subMap.get(a.id) ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getStudentFees(userId: string): Promise<FeeRecord[]> {
  try {
    const { data, error } = await admin
      .from("student_fee_records")
      .select("id, fee_type, description, amount, amount_paid, status, due_date")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as FeeRecord[]).map((r) => ({
      ...r,
      amount:      Number(r.amount),
      amount_paid: Number(r.amount_paid),
    }));
  } catch {
    return [];
  }
}

export async function getErpPageData() {
  const access = await requireErpAccess();
  if (!access.ok) return access;

  const enrolments = await getStudentEnrolments(access.user.id);
  const programId  = enrolments[0]?.program_id ?? null;

  const [attendance, marks, timetable, assignments, fees] = await Promise.all([
    getStudentAttendance(access.user.id),
    getStudentMarks(access.user.id),
    getStudentTimetable(programId),
    getStudentAssignments(programId, access.user.id),
    getStudentFees(access.user.id),
  ]);

  return {
    ok: true as const,
    user: access.user,
    enrolments,
    attendance,
    marks,
    timetable,
    assignments,
    fees,
  };
}
