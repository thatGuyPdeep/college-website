"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, FacultyAppStatus } from "@/lib/supabase/types";

const STAFF_ROLES = ["hr_staff", "admin", "super_admin"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adminClient = _adminClient as any;

async function requireHr() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !STAFF_ROLES.includes((profile as any).role)) throw new Error("Insufficient permissions");
  return { user };
}

export interface FacultyApplicationView {
  id: string;
  status: FacultyAppStatus;
  created_at: string;
  experience: Record<string, unknown>;
  applicant_name: string | null;
  applicant_email: string | null;
  vacancy_title: string | null;
  vacancy_id: string;
  files: { file_type: string; file_path: string }[];
}

export async function listFacultyApplications(filters?: {
  status?: FacultyAppStatus;
  vacancy_id?: string;
}): Promise<ActionResult<FacultyApplicationView[]>> {
  try {
    await requireHr();
    let query = adminClient
      .from("faculty_applications")
      .select("id, status, created_at, experience, vacancy_id, vacancies(title, designation), faculty_app_files(file_type, file_path)")
      .order("created_at", { ascending: false });

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.vacancy_id) query = query.eq("vacancy_id", filters.vacancy_id);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []).map((r: Record<string, unknown>) => {
      const exp = r.experience as Record<string, unknown>;
      return {
        id:              r.id as string,
        status:          r.status as FacultyAppStatus,
        created_at:      r.created_at as string,
        experience:      exp,
        vacancy_id:      r.vacancy_id as string,
        vacancy_title:   (r.vacancies as { title?: string } | null)?.title ?? null,
        applicant_name:  (exp.full_name as string) ?? null,
        applicant_email: (exp.email as string) ?? null,
        files:           (r.faculty_app_files as { file_type: string; file_path: string }[]) ?? [],
      };
    });

    return { ok: true, data: rows };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch applications" };
  }
}

export async function updateFacultyAppStatus(
  applicationId: string,
  status: FacultyAppStatus
): Promise<ActionResult<void>> {
  try {
    const { user } = await requireHr();

    const { data: existing } = await adminClient
      .from("faculty_applications")
      .select("id, status, experience, vacancies(title)")
      .eq("id", applicationId)
      .single();

    if (!existing) throw new Error("Application not found");

    const { error } = await adminClient
      .from("faculty_applications")
      .update({ status })
      .eq("id", applicationId);
    if (error) throw error;

    await adminClient.from("audit_logs").insert({
      entity_type: "faculty_application",
      entity_id:   applicationId,
      action:      "status_change",
      actor_id:    user.id,
      new_value:   { status },
    });

    const exp = existing.experience as Record<string, unknown>;
    const email = (exp.email as string | undefined)?.trim();
    const name = (exp.full_name as string | undefined) ?? "Applicant";
    const vacancyTitle = (existing.vacancies as { title?: string } | null)?.title ?? "Faculty vacancy";

    if (email && existing.status !== status && status !== "submitted") {
      const { sendRecruitmentStatusEmail } = await import("@/lib/email/recruitment");
      void sendRecruitmentStatusEmail({
        to:            email,
        applicantName: name,
        vacancyTitle,
        status,
      });
    }

    revalidatePath("/admin/recruitment");
    revalidatePath("/careers/dashboard");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function getRecruitmentStats(): Promise<ActionResult<{
  open: number;
  submitted: number;
  shortlisted: number;
  interview: number;
}>> {
  try {
    await requireHr();
    const [{ data: vacs }, { data: apps }] = await Promise.all([
      adminClient.from("vacancies").select("id").eq("status", "open"),
      adminClient.from("faculty_applications").select("status"),
    ]);
    const list = apps ?? [];
    return {
      ok: true,
      data: {
        open:         vacs?.length ?? 0,
        submitted:    list.filter((a: { status: string }) => a.status === "submitted").length,
        shortlisted:  list.filter((a: { status: string }) => a.status === "shortlisted").length,
        interview:    list.filter((a: { status: string }) => a.status === "interview").length,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed" };
  }
}
