"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { notifyStaff } from "@/lib/actions/staff-notifications";
import type { ActionResult, FacultyAppStatus, Vacancy } from "@/lib/supabase/types";
import { facultyApplicantSchema } from "@/lib/validation/recruitment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adminClient = _adminClient as any;

async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function getOpenVacancies(): Promise<ActionResult<Vacancy[]>> {
  try {
    const { data, error } = await adminClient
      .from("vacancies")
      .select("*, departments(name)")
      .eq("status", "open")
      .order("posted_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as Vacancy[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load vacancies" };
  }
}

export async function getVacancyById(id: string): Promise<ActionResult<Vacancy>> {
  try {
    const { data, error } = await adminClient
      .from("vacancies")
      .select("*, departments(name)")
      .eq("id", id)
      .single();
    if (error || !data) throw new Error("Vacancy not found");
    return { ok: true, data: data as Vacancy };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Vacancy not found" };
  }
}

export async function submitFacultyApplication(
  vacancyId: string,
  formData: unknown,
  files: { cv_path: string; cert_paths: string[] },
  options?: { dpdpConsent?: boolean }
): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user } = await getUser();
    if (!options?.dpdpConsent) throw new Error("You must accept the privacy consent to submit");
    const parsed = facultyApplicantSchema.parse(formData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data: existing } = await db
      .from("faculty_applications")
      .select("id")
      .eq("vacancy_id", vacancyId)
      .eq("applicant_id", user.id)
      .maybeSingle();

    if (existing) throw new Error("You have already applied for this vacancy");

    const { data: app, error } = await db
      .from("faculty_applications")
      .insert({
        vacancy_id:   vacancyId,
        applicant_id: user.id,
        experience: {
          ...parsed,
          dpdp_consent_at: new Date().toISOString(),
        },
        status:       "submitted",
      })
      .select("id")
      .single();

    if (error) throw error;

    await adminClient.from("faculty_app_files").insert([
      { faculty_application_id: app.id, file_type: "cv", file_path: files.cv_path },
      ...files.cert_paths.map((p: string) => ({
        faculty_application_id: app.id,
        file_type: "certificate",
        file_path: p,
      })),
    ]);

    await adminClient.from("profiles").update({ role: "faculty_applicant" }).eq("id", user.id);

    await notifyStaff({
      type:        "faculty_application",
      title:       "New faculty application submitted",
      href:        "/admin/recruitment",
      target_role: "hr_staff",
    });

    revalidatePath("/careers/dashboard");
    return { ok: true, data: { id: app.id } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Submission failed" };
  }
}

export async function getMyFacultyApplications(): Promise<ActionResult<Array<{
  id: string;
  status: FacultyAppStatus;
  created_at: string;
  vacancy: { title: string; designation: string | null } | null;
}>>> {
  try {
    const { supabase, user } = await getUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data, error } = await db
      .from("faculty_applications")
      .select("id, status, created_at, vacancies(title, designation)")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      ok:   true,
      data: (data ?? []).map((row: Record<string, unknown>) => ({
        id:         row.id as string,
        status:     row.status as FacultyAppStatus,
        created_at: row.created_at as string,
        vacancy:    row.vacancies as { title: string; designation: string | null } | null,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load applications" };
  }
}
