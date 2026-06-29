"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit/log";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireIqacStaff() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!can(role, "iqac", "view")) throw new Error("Insufficient permissions");
  return { user, role };
}

export type IqacDocument = {
  id: string;
  title: string;
  category: string;
  academic_year: string | null;
  file_url: string | null;
  link_url: string | null;
  is_published: boolean;
  created_at: string;
};

export async function listIqacDocuments(): Promise<ActionResult<IqacDocument[]>> {
  try {
    await requireIqacStaff();
    const { data, error } = await admin
      .from("iqac_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as IqacDocument[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load IQAC documents" };
  }
}

export async function upsertIqacDocument(item: {
  id?: string;
  title: string;
  category?: string;
  academic_year?: string;
  file_url?: string;
  link_url?: string;
  is_published?: boolean;
}): Promise<ActionResult<void>> {
  try {
    const { user, role } = await requireIqacStaff();
    if (!can(role, "iqac", "edit")) throw new Error("Cannot edit IQAC documents");

    const payload = {
      ...item,
      category: item.category ?? "general",
      uploaded_by: user.id,
    };

    if (item.id) {
      const { error } = await admin.from("iqac_documents").update(payload).eq("id", item.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("iqac_documents").insert(payload);
      if (error) throw error;
    }

    await writeAudit({
      entity_type: "iqac_document",
      entity_id:   item.id ?? item.title,
      action:      item.is_published ? "iqac_publish" : "iqac_save",
      actor_id:    user.id,
      new_value:   { title: item.title },
    });

    revalidatePath("/admin/iqac");
    revalidatePath("/iqac");
    revalidatePath("/cells/iqac");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function deleteIqacDocument(id: string): Promise<ActionResult<void>> {
  try {
    const { user, role } = await requireIqacStaff();
    if (!can(role, "iqac", "edit")) throw new Error("Cannot delete IQAC documents");
    const { error } = await admin.from("iqac_documents").delete().eq("id", id);
    if (error) throw error;
    await writeAudit({
      entity_type: "iqac_document",
      entity_id:   id,
      action:      "iqac_delete",
      actor_id:    user.id,
    });
    revalidatePath("/admin/iqac");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}
