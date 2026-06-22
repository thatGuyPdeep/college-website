"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, Vacancy, VacancyStatus } from "@/lib/supabase/types";

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

export async function listAdminVacancies(): Promise<ActionResult<Vacancy[]>> {
  try {
    await requireHr();
    const { data, error } = await adminClient
      .from("vacancies")
      .select("*, departments(name)")
      .order("posted_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as Vacancy[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load vacancies" };
  }
}

export async function upsertVacancy(input: {
  id?: string;
  title: string;
  designation?: string;
  description?: string;
  department_id?: string | null;
  status?: VacancyStatus;
  closes_at?: string | null;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireHr();
    const row = {
      title:         input.title,
      designation:   input.designation ?? null,
      description:   input.description ?? null,
      department_id: input.department_id ?? null,
      status:        input.status ?? "open",
      closes_at:     input.closes_at ?? null,
    };

    if (input.id) {
      const { error } = await adminClient.from("vacancies").update(row).eq("id", input.id);
      if (error) throw error;
      revalidatePath("/careers");
      revalidatePath("/admin/recruitment");
      return { ok: true, data: { id: input.id } };
    }

    const { data, error } = await adminClient.from("vacancies").insert(row).select("id").single();
    if (error) throw error;
    revalidatePath("/careers");
    revalidatePath("/admin/recruitment");
    return { ok: true, data: { id: data.id as string } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function setVacancyStatus(id: string, status: VacancyStatus): Promise<ActionResult<void>> {
  try {
    await requireHr();
    const { error } = await adminClient.from("vacancies").update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/careers");
    revalidatePath("/admin/recruitment");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}
