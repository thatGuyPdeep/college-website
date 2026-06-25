"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/admissions";
import { writeAudit } from "@/lib/audit/log";
import { notifyStaff } from "@/lib/actions/staff-notifications";
import type { ActionResult, ApplicationStatus, ApplicationView } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adminClient = _adminClient as any;

async function requireStaff() {
  const _supabase = await createClient();
  const { data: { user }, error } = await _supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");

  const { data: profile } = await _supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!profile || !can(role, "admissions", "view")) {
    throw new Error("Insufficient permissions");
  }

  return { supabase: _supabase, user, role };
}

// ── LIST APPLICATIONS ─────────────────────────────────────────────

export async function listApplications(filters?: {
  status?: ApplicationStatus;
  program_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<ApplicationView[]>> {
  try {
    await requireStaff();

    let query = adminClient
      .from("v_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(filters?.limit ?? 50)
      .range(filters?.offset ?? 0, (filters?.offset ?? 0) + (filters?.limit ?? 50) - 1);

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.program_id) query = query.eq("program_id", filters.program_id);
    if (filters?.search) {
      query = query.or(
        `applicant_name.ilike.%${filters.search}%,application_no.ilike.%${filters.search}%,applicant_email.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return { ok: true, data: (data ?? []) as ApplicationView[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch applications" };
  }
}

export async function getApplicationForStaff(id: string): Promise<ActionResult<ApplicationView>> {
  try {
    await requireStaff();
    const { data, error } = await adminClient
      .from("v_applications")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) throw new Error("Application not found");
    return { ok: true, data: data as ApplicationView };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Application not found" };
  }
}

// ── UPDATE APPLICATION STATUS ─────────────────────────────────────

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  options?: { reason?: string; note?: string }
): Promise<ActionResult<void>> {
  try {
    const { user } = await requireStaff();

    // Fetch current status for audit
    const { data: current } = await adminClient
      .from("applications")
      .select("status, personal_data, application_no, applicant_id, program_id")
      .eq("id", applicationId)
      .single();

    if (!current) throw new Error("Application not found");

    // Update status
    const decidedAt = ["approved", "rejected", "waitlisted"].includes(newStatus)
      ? new Date().toISOString()
      : null;

    const { error } = await adminClient
      .from("applications")
      .update({
        status:          newStatus,
        decided_at:      decidedAt,
        decision_reason: options?.reason ?? null,
      })
      .eq("id", applicationId);

    if (error) throw error;

    if (newStatus === "approved" && current.applicant_id) {
      await adminClient.from("profiles").update({ role: "student" }).eq("id", current.applicant_id);
      if (current.program_id) {
        await adminClient.from("student_enrolments").upsert(
          {
            user_id:       current.applicant_id,
            program_id:    current.program_id,
            academic_year: "2026-27",
            semester:      1,
            is_active:     true,
          },
          { onConflict: "user_id,program_id" }
        );
      }
    }

    // Audit log
    const auditAction =
      newStatus === "approved" ? "application_approve" :
      newStatus === "rejected" ? "application_reject" :
      "status_change";

    await writeAudit({
      entity_type: "application",
      entity_id:   applicationId,
      action:      auditAction,
      actor_id:    user.id,
      old_value:   { status: current.status },
      new_value:   { status: newStatus },
      note:        options?.note ?? options?.reason ?? null,
    });

    // Notify applicant in-app
    await adminClient.from("app_notifications").insert({
      user_id:  current.applicant_id,
      type:     "status_changed",
      title:    `Application ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      body:     options?.reason
        ? `Your application ${current.application_no} status: ${options.reason}`
        : `Your application ${current.application_no} has been ${newStatus}.`,
      metadata: { application_id: applicationId, new_status: newStatus },
    });

    // Email the applicant
    const pd = current.personal_data as { email?: string; full_name?: string } | null;
    if (pd?.email) {
      const emailType =
        newStatus === "approved"      ? "approved"      :
        newStatus === "rejected"      ? "rejected"      :
        newStatus === "waitlisted"    ? "waitlisted"    :
        newStatus === "under_review"  ? "under_review"  :
        null;

      if (emailType) {
        await sendEmail({
          type:          emailType,
          to:            pd.email,
          applicantName: pd.full_name ?? "",
          applicationNo: current.application_no ?? "",
          reason:        options?.reason,
        });
      }
    }

    revalidatePath("/admin/admissions");
    revalidatePath("/admissions/dashboard");

    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Status update failed" };
  }
}

// ── REQUEST ADDITIONAL DOCUMENTS ──────────────────────────────────

export async function requestDocuments(
  applicationId: string,
  docTypes: string[],
  message: string
): Promise<ActionResult<void>> {
  try {
    const { user } = await requireStaff();

    // Fetch applicant info
    const { data: app } = await adminClient
      .from("applications")
      .select("personal_data, application_no, applicant_id, docs_checklist")
      .eq("id", applicationId)
      .single();

    if (!app) throw new Error("Application not found");

    // Mark requested doc types as 'pending' in checklist
    const checklist = (app.docs_checklist as Record<string, unknown>) ?? {};
    for (const dt of docTypes) {
      checklist[dt] = { status: "pending", file_path: null, uploaded_at: null };
    }

    await adminClient
      .from("applications")
      .update({ docs_checklist: checklist })
      .eq("id", applicationId);

    // Update document records
    for (const dt of docTypes) {
      await adminClient
        .from("application_documents")
        .upsert(
          { application_id: applicationId, doc_type: dt, status: "pending", reason: message },
          { onConflict: "application_id,doc_type" }
        );
    }

    // Audit log
    await adminClient.from("audit_logs").insert({
      entity_type: "application",
      entity_id:   applicationId,
      action:      "docs_requested",
      actor_id:    user.id,
      new_value:   { doc_types: docTypes },
      note:        message,
    });

    // Notification
    await adminClient.from("app_notifications").insert({
      user_id:  app.applicant_id,
      type:     "doc_requested",
      title:    "Additional Documents Required",
      body:     message,
      metadata: { application_id: applicationId, doc_types: docTypes },
    });

    // Email
    const pd = app.personal_data as { email?: string; full_name?: string } | null;
    if (pd?.email) {
      await sendEmail({
        type:          "docs_requested",
        to:            pd.email,
        applicantName: pd.full_name ?? "",
        applicationNo: app.application_no ?? "",
        docTypes,
        message,
      });
    }

    revalidatePath("/admin/admissions");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to request documents" };
  }
}

// ── STATS ─────────────────────────────────────────────────────────

export async function getAdmissionStats(): Promise<ActionResult<{
  total: number;
  submitted: number;
  under_review: number;
  approved: number;
  rejected: number;
  waitlisted: number;
}>> {
  try {
    await requireStaff();

    const { data, error } = await adminClient
      .from("applications")
      .select("status");

    if (error) throw error;

    const stats = {
      total:        data.length,
      submitted:    data.filter((a: { status: string }) => a.status === "submitted").length,
      under_review: data.filter((a: { status: string }) => a.status === "under_review").length,
      approved:     data.filter((a: { status: string }) => a.status === "approved").length,
      rejected:     data.filter((a: { status: string }) => a.status === "rejected").length,
      waitlisted:   data.filter((a: { status: string }) => a.status === "waitlisted").length,
    };

    return { ok: true, data: stats };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch stats" };
  }
}

export async function getNextPendingApplication(): Promise<ActionResult<{ id: string; application_no: string | null } | null>> {
  try {
    await requireStaff();
    const { data, error } = await adminClient
      .from("applications")
      .select("id, application_no")
      .in("status", ["submitted", "under_review"])
      .order("submitted_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return { ok: true, data: data ?? null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to find next application" };
  }
}
