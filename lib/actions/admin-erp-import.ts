"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { ERP_ADMIN_ROLES } from "@/lib/auth/roles";
import { parseCsv, csvRowsToObjects } from "@/lib/erp/parse-csv";
import type { ActionResult } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const MAX_ROWS = 500;

async function requireErpAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !ERP_ADMIN_ROLES.includes((profile as any).role)) {
    throw new Error("Insufficient permissions");
  }
}

export type ImportResult = {
  imported: number;
  skipped: number;
  errors: string[];
};

function resolveStudentId(
  row: Record<string, string>,
  lookup: Map<string, string>
): string | null {
  const email = row.student_email?.trim().toLowerCase();
  const roll = row.roll_number?.trim().toLowerCase();
  if (email && lookup.has(`email:${email}`)) return lookup.get(`email:${email}`)!;
  if (roll && lookup.has(`roll:${roll}`)) return lookup.get(`roll:${roll}`)!;
  return null;
}

async function buildStudentLookup(): Promise<Map<string, string>> {
  const { data, error } = await admin
    .from("student_enrolments")
    .select("user_id, roll_number")
    .eq("is_active", true);
  if (error) throw error;

  const rows = (data ?? []) as { user_id: string; roll_number: string | null }[];
  const userIds = rows.map((r) => r.user_id);

  let emailMap = new Map<string, string>();
  if (userIds.length) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, email")
      .in("id", userIds);
    for (const p of (profiles ?? []) as { id: string; email: string | null }[]) {
      if (p.email) emailMap.set(p.id, p.email.trim().toLowerCase());
    }
  }

  const map = new Map<string, string>();
  for (const row of rows) {
    const email = emailMap.get(row.user_id);
    if (email) map.set(`email:${email}`, row.user_id);
    if (row.roll_number) map.set(`roll:${row.roll_number.trim().toLowerCase()}`, row.user_id);
  }
  return map;
}

export async function importAttendanceCsv(csvText: string): Promise<ActionResult<ImportResult>> {
  try {
    await requireErpAdmin();
    const rows = csvRowsToObjects(parseCsv(csvText));
    if (rows.length === 0) return { ok: false, error: "CSV is empty or missing a header row" };
    if (rows.length > MAX_ROWS) return { ok: false, error: `Maximum ${MAX_ROWS} rows per import` };

    const lookup = await buildStudentLookup();
    const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
    const batch: {
      user_id: string;
      course_code: string;
      course_name: string;
      date: string;
      status: string;
    }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const line = i + 2;
      const userId = resolveStudentId(row, lookup);
      if (!userId) {
        result.skipped++;
        result.errors.push(`Row ${line}: student not found (${row.student_email || row.roll_number || "?"})`);
        continue;
      }

      const course_code = row.course_code?.trim();
      const date = row.date?.trim();
      const status = (row.status?.trim().toLowerCase() ?? "present") as string;

      if (!course_code || !date) {
        result.skipped++;
        result.errors.push(`Row ${line}: missing course_code or date`);
        continue;
      }
      if (!["present", "absent", "late"].includes(status)) {
        result.skipped++;
        result.errors.push(`Row ${line}: invalid status (use present, absent, or late)`);
        continue;
      }

      batch.push({
        user_id:     userId,
        course_code,
        course_name: row.course_name?.trim() || course_code,
        date,
        status,
      });
    }

    if (batch.length) {
      const { error } = await admin.from("attendance_records").upsert(batch, {
        onConflict: "user_id,course_code,date",
      });
      if (error) throw error;
      result.imported = batch.length;
    }

    revalidatePath("/student/attendance");
    revalidatePath("/admin/erp");
    return { ok: true, data: result };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Import failed" };
  }
}

export async function importMarksCsv(csvText: string): Promise<ActionResult<ImportResult>> {
  try {
    await requireErpAdmin();
    const rows = csvRowsToObjects(parseCsv(csvText));
    if (rows.length === 0) return { ok: false, error: "CSV is empty or missing a header row" };
    if (rows.length > MAX_ROWS) return { ok: false, error: `Maximum ${MAX_ROWS} rows per import` };

    const lookup = await buildStudentLookup();
    const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
    const batch: {
      user_id: string;
      subject: string;
      exam_type: string;
      marks_obtained: number;
      max_marks: number;
      semester: number;
      academic_year: string;
    }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const line = i + 2;
      const userId = resolveStudentId(row, lookup);
      if (!userId) {
        result.skipped++;
        result.errors.push(`Row ${line}: student not found`);
        continue;
      }

      const subject = row.subject?.trim();
      const marks = Number(row.marks_obtained);
      const max = Number(row.max_marks ?? "100");

      if (!subject || Number.isNaN(marks)) {
        result.skipped++;
        result.errors.push(`Row ${line}: missing subject or marks_obtained`);
        continue;
      }

      batch.push({
        user_id:        userId,
        subject,
        exam_type:      row.exam_type?.trim() || "Internal",
        marks_obtained: marks,
        max_marks:      Number.isNaN(max) ? 100 : max,
        semester:       Number(row.semester) || 1,
        academic_year:  row.academic_year?.trim() || "2026-27",
      });
    }

    if (batch.length) {
      const { error } = await admin.from("student_marks").insert(batch);
      if (error) throw error;
      result.imported = batch.length;
    }

    revalidatePath("/student/marks");
    revalidatePath("/admin/erp");
    return { ok: true, data: result };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Import failed" };
  }
}
