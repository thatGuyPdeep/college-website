"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, NewsEvent, DisclosureItem } from "@/lib/supabase/types";
import { indexNewsForRag, indexProgramForRag, indexFacultyForRag, indexDisclosureForRag, deleteContentChunk } from "@/lib/ai/index-content";
import { writeAudit } from "@/lib/audit/log";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

const adminClient = _adminClient as ReturnType<typeof import("@supabase/supabase-js").createClient>;

async function requireEditor() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!profile || !can(role, "content", "edit")) throw new Error("Insufficient permissions");
  return { user, role };
}

export async function listNewsEvents(): Promise<ActionResult<NewsEvent[]>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("news_events")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as NewsEvent[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load news" };
  }
}

export async function upsertNewsEvent(item: Partial<NewsEvent> & { title: string; slug: string }): Promise<ActionResult<void>> {
  try {
    const { user } = await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from("news_events").upsert(item, { onConflict: "slug" });
    if (error) throw error;

    if (item.is_published) {
      await writeAudit({
        entity_type: "news_event",
        entity_id:   item.slug,
        action:      "news_publish",
        actor_id:    user.id,
        new_value:   { title: item.title },
      });
    }

    revalidatePath("/news");
    revalidatePath("/admin/content");
    if (item.is_published !== false) {
      void indexNewsForRag({
        slug:     item.slug,
        title:    item.title,
        body:     item.body ?? null,
        category: item.category ?? null,
      }).catch(() => undefined);
    }
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function listDisclosureItems(): Promise<ActionResult<DisclosureItem[]>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("disclosure_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as DisclosureItem[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load disclosure" };
  }
}

export async function upsertDisclosureItem(item: Partial<DisclosureItem> & { section: string; label: string }): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from("disclosure_items").upsert(item);
    if (error) throw error;
    revalidatePath("/disclosure");
    revalidatePath("/admin/content");
    void indexDisclosureForRag({
      section:  item.section,
      label:    item.label,
      link_url: item.link_url ?? null,
    }).catch(() => undefined);
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function deleteNewsEvent(id: string): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: row } = await (adminClient as any).from("news_events").select("slug").eq("id", id).maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from("news_events").delete().eq("id", id);
    if (error) throw error;
    if (row?.slug) void deleteContentChunk(`/news/${row.slug}`).catch(() => undefined);
    revalidatePath("/news");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

export async function listDepartments(): Promise<ActionResult<{ id: string; name: string; slug: string }[]>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("departments")
      .select("id, name, slug")
      .order("name");
    if (error) throw error;
    return { ok: true, data: data ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load departments" };
  }
}

export async function listFacultyMembers(): Promise<ActionResult<import("@/lib/supabase/types").FacultyMember[]>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("faculty")
      .select("*, departments(name)")
      .order("full_name");
    if (error) throw error;
    return { ok: true, data: (data ?? []) as import("@/lib/supabase/types").FacultyMember[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load faculty" };
  }
}

export async function upsertFacultyMember(
  item: Partial<import("@/lib/supabase/types").FacultyMember> & { full_name: string }
): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const payload = { ...item };
    let savedId = payload.id;

    if (payload.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (adminClient as any).from("faculty").update(payload).eq("id", payload.id);
      if (error) throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: inserted, error } = await (adminClient as any)
        .from("faculty")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      savedId = inserted.id as string;
    }
    revalidatePath("/faculty");
    revalidatePath("/admin/content");
    if (item.is_active !== false && item.full_name && savedId) {
      void indexFacultyForRag({
        id:               savedId,
        full_name:        item.full_name,
        designation:      item.designation ?? null,
        qualifications:   item.qualifications ?? null,
        specialization:   item.specialization ?? null,
        profile:          item.profile ?? null,
      }).catch(() => undefined);
    }
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function listProgramsAdmin(): Promise<ActionResult<import("@/lib/supabase/types").Program[]>> {
  try {
    await requireEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("programs")
      .select("*, departments(name)")
      .order("name");
    if (error) throw error;
    return { ok: true, data: (data ?? []) as import("@/lib/supabase/types").Program[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load programs" };
  }
}

export async function upsertProgramAdmin(
  item: Partial<import("@/lib/supabase/types").Program> & { name: string; slug: string; level: import("@/lib/supabase/types").ProgramLevel; mode: import("@/lib/supabase/types").StudyMode }
): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const payload = { ...item };
    if (payload.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (adminClient as any).from("programs").update(payload).eq("id", payload.id);
      if (error) throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (adminClient as any).from("programs").insert(payload);
      if (error) throw error;
    }
    revalidatePath("/academics");
    revalidatePath("/admissions");
    revalidatePath("/admin/content");
    if (item.is_active !== false && item.name && item.slug) {
      void indexProgramForRag({
        slug:        item.slug,
        name:        item.name,
        level:       item.level,
        mode:        item.mode,
        duration:    item.duration ?? null,
        eligibility: item.eligibility ?? null,
        fees:        item.fees ?? null,
      }).catch(() => undefined);
    }
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
