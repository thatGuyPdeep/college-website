"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const EDITOR_ROLES = ["content_editor", "admin", "super_admin"];

async function requireEditor() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !EDITOR_ROLES.includes((profile as any).role)) {
    throw new Error("Insufficient permissions");
  }
}

export type LeadershipEntry = {
  id: string;
  name: string;
  title: string;
  body: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export type PublicationLink = {
  id: string;
  section: "english" | "indian_language" | "highlight";
  label: string;
  href: string;
  sort_order: number;
  is_published: boolean;
};

export async function listLeadershipEntries(): Promise<ActionResult<LeadershipEntry[]>> {
  try {
    await requireEditor();
    const { data, error } = await admin
      .from("leadership_entries")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as LeadershipEntry[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load leadership" };
  }
}

export async function upsertLeadershipEntry(
  input: Partial<LeadershipEntry> & { name: string; title: string; body: string },
): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const payload = {
      name:         input.name,
      title:        input.title,
      body:         input.body,
      image_url:    input.image_url ?? null,
      sort_order:   Number(input.sort_order ?? 0),
      is_published: input.is_published ?? true,
    };
    if (input.id) {
      const { error } = await admin.from("leadership_entries").update(payload).eq("id", input.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("leadership_entries").insert(payload);
      if (error) throw error;
    }
    revalidatePath("/about");
    revalidatePath("/admin/content");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function deleteLeadershipEntry(id: string): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const { error } = await admin.from("leadership_entries").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/about");
    revalidatePath("/admin/content");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

export async function listPublicationLinks(): Promise<ActionResult<PublicationLink[]>> {
  try {
    await requireEditor();
    const { data, error } = await admin
      .from("publication_links")
      .select("*")
      .order("section")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as PublicationLink[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load publications" };
  }
}

export async function upsertPublicationLink(
  input: Partial<PublicationLink> & { section: PublicationLink["section"]; label: string; href: string },
): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const payload = {
      section:      input.section,
      label:        input.label,
      href:         input.href,
      sort_order:   Number(input.sort_order ?? 0),
      is_published: input.is_published ?? true,
    };
    if (input.id) {
      const { error } = await admin.from("publication_links").update(payload).eq("id", input.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("publication_links").insert(payload);
      if (error) throw error;
    }
    revalidatePath("/campus/library");
    revalidatePath("/admin/content");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function deletePublicationLink(id: string): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const { error } = await admin.from("publication_links").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/campus/library");
    revalidatePath("/admin/content");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

export async function seedSiteContentFromStatic(): Promise<ActionResult<{ leadership: number; publications: number }>> {
  try {
    await requireEditor();
    const { LEADERSHIP } = await import("@/lib/utils/constants");
    const {
      PUBLICATIONS_ENGLISH,
      PUBLICATIONS_INDIAN_LANGUAGES,
      ESSENTIAL_BOOKS_HIGHLIGHTS,
    } = await import("@/lib/content/publications");

    const { count: lc } = await admin.from("leadership_entries").select("id", { count: "exact", head: true });
    if ((lc ?? 0) === 0) {
      await admin.from("leadership_entries").insert(
        LEADERSHIP.map((p, i) => ({
          name: p.name,
          title: p.title,
          body: p.body,
          sort_order: i,
          is_published: true,
        })),
      );
    }

    const { count: pc } = await admin.from("publication_links").select("id", { count: "exact", head: true });
    if ((pc ?? 0) === 0) {
      const links = [
        ...PUBLICATIONS_ENGLISH.map((p, i) => ({ section: "english", label: p.label, href: p.href, sort_order: i })),
        ...PUBLICATIONS_INDIAN_LANGUAGES.map((p, i) => ({
          section: "indian_language",
          label: p.label,
          href: p.href,
          sort_order: i,
        })),
        ...ESSENTIAL_BOOKS_HIGHLIGHTS.map((label, i) => ({
          section: "highlight",
          label,
          href: "https://publications.rkmm.org/essential-books",
          sort_order: i,
        })),
      ];
      await admin.from("publication_links").insert(links);
    }

    revalidatePath("/about");
    revalidatePath("/campus/library");
    return { ok: true, data: { leadership: LEADERSHIP.length, publications: PUBLICATIONS_ENGLISH.length + PUBLICATIONS_INDIAN_LANGUAGES.length + ESSENTIAL_BOOKS_HIGHLIGHTS.length } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Seed failed" };
  }
}
