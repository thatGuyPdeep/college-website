"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit/log";
import type { ActionResult } from "@/lib/supabase/types";
import { ERP_ADMIN_ROLES } from "@/lib/auth/roles";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireErpAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !ERP_ADMIN_ROLES.includes((profile as any).role)) {
    throw new Error("Insufficient permissions");
  }
  return { user };
}

export type EnrolledStudent = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  roll_number: string | null;
  program_name: string | null;
  program_id: string | null;
};

export type ProgramOption = { id: string; name: string; slug: string };

export async function listEnrolledStudents(): Promise<ActionResult<EnrolledStudent[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin
      .from("student_enrolments")
      .select("user_id, roll_number, program_id, programs(name)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const rows = (data ?? []) as {
      user_id: string;
      roll_number: string | null;
      program_id: string | null;
      programs?: { name: string } | null;
    }[];

    const userIds = rows.map((r) => r.user_id);
    let profileMap = new Map<string, { full_name: string | null; email: string | null }>();
    if (userIds.length) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      for (const p of (profiles ?? []) as { id: string; full_name: string | null; email: string | null }[]) {
        profileMap.set(p.id, { full_name: p.full_name, email: p.email });
      }
    }

    return {
      ok: true,
      data: rows.map((r) => {
        const profile = profileMap.get(r.user_id);
        return {
          user_id:      r.user_id,
          full_name:    profile?.full_name ?? null,
          email:        profile?.email ?? null,
          roll_number:  r.roll_number,
          program_name: r.programs?.name ?? null,
          program_id:   r.program_id,
        };
      }),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load students" };
  }
}

export async function listProgramOptions(): Promise<ActionResult<ProgramOption[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin.from("programs").select("id, name, slug").eq("is_active", true).order("name");
    if (error) throw error;
    return { ok: true, data: (data ?? []) as ProgramOption[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load programmes" };
  }
}

export async function publishErpNotice(input: {
  title: string;
  body?: string;
  audience?: string;
}): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const { error } = await admin.from("erp_notices").insert({
      title:        input.title,
      body:         input.body ?? null,
      audience:     input.audience ?? "student",
      is_published: true,
    });
    if (error) throw error;
    revalidatePath("/student");
    revalidatePath("/admin/erp");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to publish notice" };
  }
}

export async function recordAttendance(input: {
  user_id: string;
  course_code: string;
  course_name?: string;
  date: string;
  status: "present" | "absent" | "late";
}): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const { error } = await admin.from("attendance_records").upsert(
      {
        user_id:     input.user_id,
        course_code: input.course_code,
        course_name: input.course_name ?? input.course_code,
        date:        input.date,
        status:      input.status,
      },
      { onConflict: "user_id,course_code,date" }
    );
    if (error) throw error;
    revalidatePath("/student/attendance");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to record attendance" };
  }
}

export async function publishMark(input: {
  user_id: string;
  subject: string;
  exam_type?: string;
  marks_obtained: number;
  max_marks: number;
  semester?: number;
  academic_year?: string;
}): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const { error } = await admin.from("student_marks").insert({
      user_id:        input.user_id,
      subject:        input.subject,
      exam_type:      input.exam_type ?? "Internal",
      marks_obtained: input.marks_obtained,
      max_marks:      input.max_marks,
      semester:       input.semester ?? 1,
      academic_year:  input.academic_year ?? "2026-27",
    });
    if (error) throw error;
    revalidatePath("/student/marks");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to publish marks" };
  }
}

export async function addTimetableSlot(input: {
  program_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  room?: string;
  faculty_name?: string;
}): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const { error } = await admin.from("timetable_slots").insert(input);
    if (error) throw error;
    revalidatePath("/student/timetable");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to add timetable slot" };
  }
}

export async function createAssignment(input: {
  program_id: string;
  title: string;
  description?: string;
  due_at?: string;
}): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const { error } = await admin.from("assignments").insert(input);
    if (error) throw error;
    revalidatePath("/student/assignments");
    revalidatePath("/admin/erp");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create assignment" };
  }
}

export type AdminAssignment = {
  id: string;
  title: string;
  program_id: string | null;
  program_name: string | null;
  due_at: string | null;
  submission_count: number;
};

export type GradingSubmission = {
  id: string;
  assignment_id: string;
  assignment_title: string;
  user_id: string;
  student_name: string | null;
  student_email: string | null;
  roll_number: string | null;
  file_path: string | null;
  submitted_at: string;
  grade: string | null;
};

export async function listAdminAssignments(): Promise<ActionResult<AdminAssignment[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin
      .from("assignments")
      .select("id, title, program_id, due_at, programs(name)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;

    const rows = (data ?? []) as {
      id: string;
      title: string;
      program_id: string | null;
      due_at: string | null;
      programs?: { name: string } | null;
    }[];

    const ids = rows.map((r) => r.id);
    let countMap = new Map<string, number>();
    if (ids.length) {
      const { data: subs } = await admin
        .from("assignment_submissions")
        .select("assignment_id")
        .in("assignment_id", ids);
      for (const s of (subs ?? []) as { assignment_id: string }[]) {
        countMap.set(s.assignment_id, (countMap.get(s.assignment_id) ?? 0) + 1);
      }
    }

    return {
      ok: true,
      data: rows.map((r) => ({
        id:               r.id,
        title:            r.title,
        program_id:       r.program_id,
        program_name:     r.programs?.name ?? null,
        due_at:           r.due_at,
        submission_count: countMap.get(r.id) ?? 0,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load assignments" };
  }
}

export async function listGradingSubmissions(filters?: {
  assignment_id?: string;
  program_id?: string;
}): Promise<ActionResult<GradingSubmission[]>> {
  try {
    await requireErpAdmin();

    let assignmentIds: string[] | null = null;
    if (filters?.program_id) {
      const { data: assignments } = await admin
        .from("assignments")
        .select("id")
        .eq("program_id", filters.program_id);
      assignmentIds = ((assignments ?? []) as { id: string }[]).map((a) => a.id);
      if (assignmentIds.length === 0) return { ok: true, data: [] };
    }

    let query = admin
      .from("assignment_submissions")
      .select("id, assignment_id, user_id, file_path, submitted_at, grade, assignments(title)")
      .order("submitted_at", { ascending: false })
      .limit(100);

    if (filters?.assignment_id) {
      query = query.eq("assignment_id", filters.assignment_id);
    } else if (assignmentIds) {
      query = query.in("assignment_id", assignmentIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as {
      id: string;
      assignment_id: string;
      user_id: string;
      file_path: string | null;
      submitted_at: string;
      grade: string | null;
      assignments?: { title: string } | null;
    }[];

    const userIds = [...new Set(rows.map((r) => r.user_id))];
    let profileMap = new Map<string, { full_name: string | null; email: string | null }>();
    let rollMap = new Map<string, string | null>();

    if (userIds.length) {
      const [{ data: profiles }, { data: enrolments }] = await Promise.all([
        admin.from("profiles").select("id, full_name, email").in("id", userIds),
        admin.from("student_enrolments").select("user_id, roll_number").in("user_id", userIds).eq("is_active", true),
      ]);
      for (const p of (profiles ?? []) as { id: string; full_name: string | null; email: string | null }[]) {
        profileMap.set(p.id, { full_name: p.full_name, email: p.email });
      }
      for (const e of (enrolments ?? []) as { user_id: string; roll_number: string | null }[]) {
        rollMap.set(e.user_id, e.roll_number);
      }
    }

    return {
      ok: true,
      data: rows.map((r) => {
        const profile = profileMap.get(r.user_id);
        return {
          id:               r.id,
          assignment_id:    r.assignment_id,
          assignment_title: r.assignments?.title ?? "Assignment",
          user_id:          r.user_id,
          student_name:     profile?.full_name ?? null,
          student_email:    profile?.email ?? null,
          roll_number:      rollMap.get(r.user_id) ?? null,
          file_path:        r.file_path,
          submitted_at:     r.submitted_at,
          grade:            r.grade,
        };
      }),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load submissions" };
  }
}

export async function gradeSubmission(
  submissionId: string,
  grade: string
): Promise<ActionResult<void>> {
  try {
    const { user } = await requireErpAdmin();
    const trimmed = grade.trim();
    if (!trimmed) throw new Error("Grade is required");

    const { error } = await admin
      .from("assignment_submissions")
      .update({ grade: trimmed })
      .eq("id", submissionId);
    if (error) throw error;

    await writeAudit({
      entity_type: "erp_submission",
      entity_id:   submissionId,
      action:      "grade_update",
      actor_id:    user.id,
      new_value:   { grade: trimmed },
    });

    revalidatePath("/student/assignments");
    revalidatePath("/admin/erp");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save grade" };
  }
}

export async function updateEnrolmentRoll(
  userId: string,
  rollNumber: string
): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const roll = rollNumber.trim();
    if (!roll) throw new Error("Roll number is required");

    const { error } = await admin
      .from("student_enrolments")
      .update({ roll_number: roll })
      .eq("user_id", userId)
      .eq("is_active", true);
    if (error) throw error;

    revalidatePath("/admin/erp");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update roll number" };
  }
}

export async function getErpAdminSummary(): Promise<ActionResult<{
  notices: number;
  students: number;
  assignments: number;
  attendanceRecords: number;
  marksEntries: number;
  pendingFees: number;
}>> {
  try {
    await requireErpAdmin();
    const [notices, students, assignments, attendance, marks, fees] = await Promise.all([
      admin.from("erp_notices").select("id", { count: "exact", head: true }),
      admin.from("student_enrolments").select("id", { count: "exact", head: true }).eq("is_active", true),
      admin.from("assignments").select("id", { count: "exact", head: true }),
      admin.from("attendance_records").select("id", { count: "exact", head: true }),
      admin.from("student_marks").select("id", { count: "exact", head: true }),
      admin.from("student_fee_records").select("id", { count: "exact", head: true }).in("status", ["pending", "partial"]),
    ]);
    return {
      ok: true,
      data: {
        notices:            notices.count ?? 0,
        students:           students.count ?? 0,
        assignments:        assignments.count ?? 0,
        attendanceRecords:  attendance.count ?? 0,
        marksEntries:       marks.count ?? 0,
        pendingFees:        fees.count ?? 0,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load summary" };
  }
}

export type ErpNoticeRow = { id: string; title: string; audience: string; published_at: string };
export type AttendanceRow = { id: string; student_name: string | null; course_code: string; date: string; status: string };
export type MarkRow = { id: string; student_name: string | null; subject: string; marks_obtained: number; max_marks: number };
export type TimetableRow = { id: string; program_name: string | null; day_of_week: number; start_time: string; end_time: string; subject: string; room: string | null };
export type FeeRow = {
  id: string;
  user_id: string;
  student_name: string | null;
  fee_type: string;
  description: string | null;
  amount: number;
  amount_paid: number;
  status: string;
  due_date: string | null;
};

export async function listErpNotices(): Promise<ActionResult<ErpNoticeRow[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin
      .from("erp_notices")
      .select("id, title, audience, published_at")
      .order("published_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    return { ok: true, data: (data ?? []) as ErpNoticeRow[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load notices" };
  }
}

export async function listRecentAttendance(limit = 40): Promise<ActionResult<AttendanceRow[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin
      .from("attendance_records")
      .select("id, user_id, course_code, date, status")
      .order("date", { ascending: false })
      .limit(limit);
    if (error) throw error;
    const rows = (data ?? []) as { id: string; user_id: string; course_code: string; date: string; status: string }[];
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const profileMap = await profileNameMap(userIds);
    return {
      ok: true,
      data: rows.map((r) => ({
        id:           r.id,
        student_name: profileMap.get(r.user_id) ?? null,
        course_code:  r.course_code,
        date:         r.date,
        status:       r.status,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load attendance" };
  }
}

export async function listRecentMarks(limit = 40): Promise<ActionResult<MarkRow[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin
      .from("student_marks")
      .select("id, user_id, subject, marks_obtained, max_marks")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    const rows = (data ?? []) as { id: string; user_id: string; subject: string; marks_obtained: number; max_marks: number }[];
    const profileMap = await profileNameMap([...new Set(rows.map((r) => r.user_id))]);
    return {
      ok: true,
      data: rows.map((r) => ({
        id:             r.id,
        student_name:   profileMap.get(r.user_id) ?? null,
        subject:        r.subject,
        marks_obtained: Number(r.marks_obtained),
        max_marks:      Number(r.max_marks),
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load marks" };
  }
}

export async function listTimetableSlots(programId?: string): Promise<ActionResult<TimetableRow[]>> {
  try {
    await requireErpAdmin();
    let query = admin
      .from("timetable_slots")
      .select("id, day_of_week, start_time, end_time, subject, room, programs(name)")
      .order("day_of_week")
      .order("start_time");
    if (programId) query = query.eq("program_id", programId);
    const { data, error } = await query.limit(100);
    if (error) throw error;
    const rows = (data ?? []) as {
      id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      subject: string;
      room: string | null;
      programs?: { name: string } | null;
    }[];
    return {
      ok: true,
      data: rows.map((r) => ({
        id:           r.id,
        program_name: r.programs?.name ?? null,
        day_of_week:  r.day_of_week,
        start_time:   r.start_time,
        end_time:     r.end_time,
        subject:      r.subject,
        room:         r.room,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load timetable" };
  }
}

export async function listFeeRecords(): Promise<ActionResult<FeeRow[]>> {
  try {
    await requireErpAdmin();
    const { data, error } = await admin
      .from("student_fee_records")
      .select("id, user_id, fee_type, description, amount, amount_paid, status, due_date")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    const rows = (data ?? []) as FeeRow[];
    const profileMap = await profileNameMap([...new Set(rows.map((r) => r.user_id))]);
    return {
      ok: true,
      data: rows.map((r) => ({
        ...r,
        amount:      Number(r.amount),
        amount_paid: Number(r.amount_paid),
        student_name: profileMap.get(r.user_id) ?? null,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load fees" };
  }
}

export async function createFeeRecord(input: {
  user_id: string;
  fee_type?: string;
  description?: string;
  amount: number;
  due_date?: string;
  academic_year?: string;
}): Promise<ActionResult<void>> {
  try {
    await requireErpAdmin();
    const { error } = await admin.from("student_fee_records").insert({
      user_id:       input.user_id,
      fee_type:      input.fee_type ?? "tuition",
      description:   input.description ?? null,
      amount:        input.amount,
      amount_paid:   0,
      due_date:      input.due_date ?? null,
      academic_year: input.academic_year ?? "2026-27",
      status:        "pending",
    });
    if (error) throw error;
    revalidatePath("/admin/erp");
    revalidatePath("/student");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create fee record" };
  }
}

export async function recordFeePayment(
  feeId: string,
  amountPaid: number,
): Promise<ActionResult<void>> {
  try {
    const { user } = await requireErpAdmin();
    const { data: row, error: fetchErr } = await admin
      .from("student_fee_records")
      .select("amount, amount_paid")
      .eq("id", feeId)
      .single();
    if (fetchErr || !row) throw fetchErr ?? new Error("Fee record not found");

    const total = Number((row as { amount: number }).amount);
    const paid = Number((row as { amount_paid: number }).amount_paid) + amountPaid;
    const status = paid >= total ? "paid" : paid > 0 ? "partial" : "pending";

    const { error } = await admin
      .from("student_fee_records")
      .update({ amount_paid: paid, status })
      .eq("id", feeId);
    if (error) throw error;

    await writeAudit({
      entity_type: "erp_fee",
      entity_id:   feeId,
      action:      "fee_payment",
      actor_id:    user.id,
      new_value:   { amount_paid: amountPaid, status },
    });

    revalidatePath("/admin/erp");
    revalidatePath("/student");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to record payment" };
  }
}

async function profileNameMap(userIds: string[]): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  if (!userIds.length) return map;
  const { data: profiles } = await admin.from("profiles").select("id, full_name").in("id", userIds);
  for (const p of (profiles ?? []) as { id: string; full_name: string | null }[]) {
    map.set(p.id, p.full_name);
  }
  return map;
}

