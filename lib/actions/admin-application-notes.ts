"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireNotesAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!profile || !can(role, "admissions", "view")) throw new Error("Insufficient permissions");
  return { user, role };
}

export type InternalNote = {
  id: string;
  body: string;
  created_at: string;
  author_name: string | null;
};

export async function listApplicationNotes(applicationId: string): Promise<ActionResult<InternalNote[]>> {
  try {
    await requireNotesAccess();
    const { data, error } = await admin
      .from("application_internal_notes")
      .select("id, body, created_at, author_id")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const authorIds = [...new Set((data ?? []).map((n: { author_id: string }) => n.author_id))];
    const { data: authors } = authorIds.length
      ? await admin.from("profiles").select("id, full_name").in("id", authorIds)
      : { data: [] };

    const nameMap = Object.fromEntries(
      (authors ?? []).map((a: { id: string; full_name: string | null }) => [a.id, a.full_name]),
    );

    const notes = (data ?? []).map((n: { id: string; body: string; created_at: string; author_id: string }) => ({
      id:          n.id,
      body:        n.body,
      created_at:  n.created_at,
      author_name: nameMap[n.author_id] ?? null,
    }));

    return { ok: true, data: notes };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load notes" };
  }
}

export async function addApplicationNote(applicationId: string, body: string): Promise<ActionResult<void>> {
  try {
    const { user } = await requireNotesAccess();
    if (!body.trim()) throw new Error("Note cannot be empty");

    const { error } = await admin.from("application_internal_notes").insert({
      application_id: applicationId,
      author_id:    user.id,
      body:         body.trim(),
    });

    if (error) throw error;
    revalidatePath(`/admin/admissions/${applicationId}`);
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to add note" };
  }
}
