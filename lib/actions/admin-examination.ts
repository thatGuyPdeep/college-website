"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit/log";
import { notifyStaff } from "@/lib/actions/staff-notifications";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireExamStaff() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!can(role, "examination", "view")) throw new Error("Insufficient permissions");
  return { user, role };
}

export type ExamNotice = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at?: string;
};

export async function listExamNotices(): Promise<ActionResult<ExamNotice[]>> {
  try {
    await requireExamStaff();
    const { data, error } = await admin
      .from("news_events")
      .select("id, title, slug, category, is_published, published_at")
      .or("category.eq.examination,category.eq.Examination")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as ExamNotice[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load notices" };
  }
}

export async function upsertExamNotice(item: {
  id?: string;
  title: string;
  slug: string;
  body?: string;
  is_published?: boolean;
  scheduled_publish_at?: string | null;
}): Promise<ActionResult<void>> {
  try {
    const { user, role } = await requireExamStaff();
    if (!can(role, "examination", "edit")) throw new Error("Cannot edit examination notices");

    const payload = {
      ...item,
      category: "examination",
      published_at: item.is_published ? new Date().toISOString() : null,
    };

    const { error } = await admin.from("news_events").upsert(payload, { onConflict: "slug" });
    if (error) throw error;

    await writeAudit({
      entity_type: "news_event",
      entity_id:   item.slug,
      action:      item.is_published ? "news_publish" : "news_draft",
      actor_id:    user.id,
      new_value:   { title: item.title, category: "examination" },
    });

    if (item.is_published) {
      await notifyStaff({
        type:        "content_draft",
        title:       `Exam notice published: ${item.title}`,
        href:        `/news/${item.slug}`,
        target_role: "examination_staff",
      });
    }

    revalidatePath("/admin/examination");
    revalidatePath("/examination");
    revalidatePath("/news");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
