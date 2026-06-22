"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";

const EDITOR_ROLES = ["content_editor", "admin", "super_admin"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type GalleryItem = {
  id: string;
  item_type: "photo" | "video";
  title: string;
  media_ref: string;
  year: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

async function requireEditor() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !EDITOR_ROLES.includes((profile as any).role)) throw new Error("Insufficient permissions");
}

export async function listGalleryItems(): Promise<ActionResult<GalleryItem[]>> {
  try {
    await requireEditor();
    const { data, error } = await admin
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as GalleryItem[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load gallery" };
  }
}

export async function upsertGalleryItem(item: {
  id?: string;
  item_type: "photo" | "video";
  title: string;
  media_ref: string;
  year?: string;
  sort_order?: number;
  is_published?: boolean;
}): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const payload = {
      item_type:    item.item_type,
      title:        item.title,
      media_ref:    item.media_ref.trim(),
      year:         item.year?.trim() || null,
      sort_order:   item.sort_order ?? 0,
      is_published: item.is_published ?? true,
    };

    if (item.id) {
      const { error } = await admin.from("gallery_items").update(payload).eq("id", item.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("gallery_items").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/content");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult<void>> {
  try {
    await requireEditor();
    const { error } = await admin.from("gallery_items").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/gallery");
    revalidatePath("/admin/content");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}
