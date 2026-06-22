"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { isPaymentRequired } from "@/lib/payments/razorpay";
import { isApplicationPaid } from "@/lib/actions/payments";
import { sendEmail } from "@/lib/email/admissions";
import {
  hasPersonalData,
  hasAcademicData,
  hasProgramChoice,
  missingDocuments,
} from "@/lib/admissions/helpers";
import type {
  ActionResult,
  Application,
  PersonalData,
  AcademicData,
  ProgramData,
  DocsChecklist,
} from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = adminClient as any;

// ── HELPERS ───────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const _supabase = await createClient();
  const { data: { user }, error } = await _supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = _supabase as any;
  return { supabase, user };
}

async function assertOwnDraft(applicationId: string, userId: string) {
  const { data, error } = await db
    .from("applications")
    .select("id, status, applicant_id")
    .eq("id", applicationId)
    .eq("applicant_id", userId)
    .eq("status", "draft")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Application not found or already submitted");
  return data;
}

async function writeAuditLog(params: {
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  note?: string;
}) {
  await db.from("audit_logs").insert({
    entity_type: params.entity_type,
    entity_id:   params.entity_id,
    action:      params.action,
    actor_id:    params.actor_id,
    old_value:   params.old_value ?? null,
    new_value:   params.new_value ?? null,
    note:        params.note ?? null,
  });
}

// ── PROGRAMMES ────────────────────────────────────────────────────

export async function getActivePrograms(): Promise<ActionResult<Array<{ id: string; name: string; level: string }>>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("id, name, level")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return { ok: true, data: data ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load programmes" };
  }
}

// ── CREATE OR RESUME DRAFT ────────────────────────────────────────

export async function createOrResumeDraft(): Promise<ActionResult<Application>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // maybeSingle — .single() throws when no draft exists (breaks first-time applicants)
    const { data: existing, error: findErr } = await supabase
      .from("applications")
      .select("*")
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findErr) throw findErr;
    if (existing) return { ok: true, data: existing as Application };

    const { data, error } = await supabase
      .from("applications")
      .insert({
        applicant_id:  user.id,
        status:        "draft",
        current_step:  1,
        academic_year: "2026-27",
      })
      .select("*")
      .single();

    if (error) throw error;

    await writeAuditLog({
      entity_type: "application",
      entity_id:   data.id,
      action:      "created",
      actor_id:    user.id,
    });

    return { ok: true, data: data as Application };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create application" };
  }
}

// ── SAVE STEPS ────────────────────────────────────────────────────

export async function savePersonalStep(
  applicationId: string,
  data: PersonalData
): Promise<ActionResult<void>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    await assertOwnDraft(applicationId, user.id);

    const { data: rows, error } = await supabase
      .from("applications")
      .update({ personal_data: data, current_step: 2 })
      .eq("id", applicationId)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .select("id");

    if (error) throw error;
    if (!rows?.length) throw new Error("Could not save personal details");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Autosave failed" };
  }
}

export async function saveAcademicStep(
  applicationId: string,
  data: AcademicData
): Promise<ActionResult<void>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    await assertOwnDraft(applicationId, user.id);

    if (!data.tenth?.board?.trim() || !data.tenth?.year?.trim()) {
      throw new Error("10th board and year of passing are required");
    }

    const { data: rows, error } = await supabase
      .from("applications")
      .update({ academic_data: data, current_step: 3 })
      .eq("id", applicationId)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .select("id");

    if (error) throw error;
    if (!rows?.length) throw new Error("Could not save academic details");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Autosave failed" };
  }
}

export async function saveProgramStep(
  applicationId: string,
  data: ProgramData
): Promise<ActionResult<void>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    await assertOwnDraft(applicationId, user.id);

    if (!data.program_id) throw new Error("Please select a programme");

    const { data: rows, error } = await supabase
      .from("applications")
      .update({
        program_data: data,
        program_id:   data.program_id,
        current_step: 4,
      })
      .eq("id", applicationId)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .select("id");

    if (error) throw error;
    if (!rows?.length) throw new Error("Could not save programme choice");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Autosave failed" };
  }
}

export async function saveDocumentsStep(
  applicationId: string
): Promise<ActionResult<void>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    await assertOwnDraft(applicationId, user.id);

    const { data: rows, error } = await supabase
      .from("applications")
      .update({ current_step: 5 })
      .eq("id", applicationId)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .select("id");

    if (error) throw error;
    if (!rows?.length) throw new Error("Could not update progress");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save progress" };
  }
}

// ── DOCUMENT UPLOAD RECORD ────────────────────────────────────────

export async function recordDocumentUploaded(
  applicationId: string,
  docType: string,
  filePath: string
): Promise<ActionResult<void>> {
  try {
    const { user } = await getAuthenticatedUser();
    await assertOwnDraft(applicationId, user.id);

    const { data: existingDoc } = await db
      .from("application_documents")
      .select("id")
      .eq("application_id", applicationId)
      .eq("doc_type", docType)
      .maybeSingle();

    const docPayload = {
      application_id: applicationId,
      doc_type:       docType,
      file_path:      filePath,
      status:         "submitted",
      uploaded_at:    new Date().toISOString(),
    };

    const { error: docError } = existingDoc
      ? await db.from("application_documents").update(docPayload).eq("id", existingDoc.id)
      : await db.from("application_documents").insert(docPayload);

    if (docError) throw docError;

    const { data: app } = await db
      .from("applications")
      .select("docs_checklist")
      .eq("id", applicationId)
      .single();

    const checklist: DocsChecklist = (app?.docs_checklist as DocsChecklist) ?? {};
    checklist[docType] = {
      status:      "submitted",
      file_path:   filePath,
      uploaded_at: new Date().toISOString(),
    };

    const { error: updateErr } = await db
      .from("applications")
      .update({ docs_checklist: checklist })
      .eq("id", applicationId)
      .eq("applicant_id", user.id);

    if (updateErr) throw updateErr;

    await writeAuditLog({
      entity_type: "application",
      entity_id:   applicationId,
      action:      "doc_uploaded",
      actor_id:    user.id,
      new_value:   { doc_type: docType, file_path: filePath },
    });

    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to record document" };
  }
}

// ── SUBMIT ────────────────────────────────────────────────────────

export async function submitApplication(
  applicationId: string,
  options?: { dpdpConsent?: boolean }
): Promise<ActionResult<{ application_no: string }>> {
  try {
    const { user } = await getAuthenticatedUser();

    if (!options?.dpdpConsent) {
      throw new Error("You must accept the privacy consent to submit");
    }

    if (isPaymentRequired()) {
      const paid = await isApplicationPaid(applicationId);
      if (!paid.ok || !paid.data) {
        throw new Error("Application fee payment is required before submit");
      }
    }

    const { data: app, error: fetchErr } = await db
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .maybeSingle();

    if (fetchErr || !app) {
      throw new Error("Application not found or already submitted");
    }

    if (!hasPersonalData(app.personal_data)) {
      throw new Error("Personal details are incomplete — go back to Step 1");
    }
    if (!hasAcademicData(app.academic_data)) {
      throw new Error("Academic details are incomplete — go back to Step 2");
    }
    if (!hasProgramChoice(app)) {
      throw new Error("Programme choice is required — go back to Step 3");
    }

    const missing = missingDocuments(app.docs_checklist as DocsChecklist);
    if (missing.length > 0) {
      throw new Error(`Please upload all documents: ${missing.join(", ")}`);
    }

    const { data: updated, error: updateErr } = await db
      .from("applications")
      .update({
        status:           "submitted",
        submitted_at:     new Date().toISOString(),
        dpdp_consent_at:  new Date().toISOString(),
        current_step:     6,
      })
      .eq("id", applicationId)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .select("application_no")
      .single();

    if (updateErr) throw updateErr;
    if (!updated?.application_no) {
      throw new Error("Could not generate application number. Please try again.");
    }

    await writeAuditLog({
      entity_type: "application",
      entity_id:   applicationId,
      action:      "submitted",
      actor_id:    user.id,
      new_value:   { application_no: updated.application_no },
    });

    await db.from("app_notifications").insert({
      user_id:  user.id,
      type:     "application_submitted",
      title:    "Application Submitted",
      body:     `Your application ${updated.application_no} has been received.`,
      metadata: { application_id: applicationId, application_no: updated.application_no },
    });

    const personalData = app.personal_data as PersonalData;
    await sendEmail({
      type:          "submitted",
      to:            personalData.email ?? user.email ?? "",
      applicantName: personalData.full_name,
      applicationNo: updated.application_no,
    });

    revalidatePath("/admissions/dashboard");
    revalidatePath("/admissions/apply");

    return { ok: true, data: { application_no: updated.application_no } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Submission failed" };
  }
}

// ── READ ──────────────────────────────────────────────────────────

export async function getApplicationPaymentMap(
  applicationIds: string[]
): Promise<Record<string, boolean>> {
  if (!isPaymentRequired() || applicationIds.length === 0) {
    return Object.fromEntries(applicationIds.map((id) => [id, true]));
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await db
      .from("payments")
      .select("application_id")
      .in("application_id", applicationIds)
      .eq("status", "paid");
    const paidSet = new Set(((data ?? []) as { application_id: string }[]).map((p) => p.application_id));
    return Object.fromEntries(applicationIds.map((id) => [id, paidSet.has(id)]));
  } catch {
    return Object.fromEntries(applicationIds.map((id) => [id, false]));
  }
}

export async function getMyApplications(): Promise<ActionResult<Application[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("applications")
      .select("*, programs(name, level)")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { ok: true, data: (data ?? []) as Application[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch applications" };
  }
}

export async function getApplicationById(
  id: string
): Promise<ActionResult<Application>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("applications")
      .select("*, programs(name, level, fees), application_documents(*)")
      .eq("id", id)
      .eq("applicant_id", user.id)
      .single();

    if (error) throw error;
    return { ok: true, data: data as Application };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Application not found" };
  }
}

export async function getMyNotifications() {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { data, error } = await supabase
      .from("app_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return { ok: true as const, data: data ?? [] };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Failed" };
  }
}

export async function markNotificationsRead(ids: string[]) {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    await supabase
      .from("app_notifications")
      .update({ is_read: true })
      .in("id", ids)
      .eq("user_id", user.id);
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Failed to mark read" };
  }
}
