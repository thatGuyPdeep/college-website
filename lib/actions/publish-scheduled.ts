"use server";

import { revalidatePath } from "next/cache";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit/log";
import { indexNewsForRag } from "@/lib/ai/index-content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

/** Publish news/exam notices whose scheduled_publish_at has passed. */
export async function publishDueScheduledContent(): Promise<{ published: number }> {
  const now = new Date().toISOString();

  const { data: due, error } = await admin
    .from("news_events")
    .select("id, slug, title, body, category, scheduled_publish_at")
    .eq("is_published", false)
    .not("scheduled_publish_at", "is", null)
    .lte("scheduled_publish_at", now)
    .limit(50);

  if (error) {
    console.error("[publish-scheduled]", error.message);
    return { published: 0 };
  }

  let published = 0;
  for (const item of due ?? []) {
    const { error: updErr } = await admin
      .from("news_events")
      .update({
        is_published:         true,
        published_at:           now,
        scheduled_publish_at: null,
      })
      .eq("id", item.id);

    if (updErr) continue;

    await writeAudit({
      entity_type: "news_event",
      entity_id:   item.slug as string,
      action:      "scheduled_publish",
      actor_id:    null,
      new_value:   { title: item.title, category: item.category },
      notify:      true,
    });

    void indexNewsForRag({
      slug:     item.slug as string,
      title:    item.title as string,
      body:     (item.body as string) ?? null,
      category: (item.category as string) ?? null,
    }).catch(() => undefined);

    published++;
  }

  if (published > 0) {
    revalidatePath("/news");
    revalidatePath("/examination");
    revalidatePath("/admin/content");
    revalidatePath("/admin/examination");
  }

  return { published };
}
