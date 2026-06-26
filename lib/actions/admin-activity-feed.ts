"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult, UserRole } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import {
  canViewEntityType,
  formatAuditLine,
  hrefForAudit,
  type ActivityFeedItem,
} from "@/lib/audit/activity-feed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireFeedAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!can(role, "dashboard", "view")) throw new Error("Insufficient permissions");
  return { role };
}

export async function listActivityFeed(limit = 15): Promise<ActionResult<ActivityFeedItem[]>> {
  try {
    const { role } = await requireFeedAccess();

    const { data, error } = await admin
      .from("audit_logs")
      .select("id, entity_type, entity_id, action, note, new_value, created_at")
      .order("created_at", { ascending: false })
      .limit(80);

    if (error) throw error;

    const items: ActivityFeedItem[] = (data ?? [])
      .filter((row: { entity_type: string }) => canViewEntityType(role, row.entity_type))
      .slice(0, limit)
      .map((row: {
        id: string;
        entity_type: string;
        entity_id: string;
        action: string;
        note: string | null;
        new_value: Record<string, unknown> | null;
        created_at: string;
      }) => ({
        id:          row.id,
        text:        formatAuditLine(row),
        at:          row.created_at,
        entity_type: row.entity_type,
        entity_id:   row.entity_id,
        action:      row.action,
        href:        hrefForAudit(row.entity_type, row.entity_id),
      }));

    return { ok: true, data: items };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load activity feed" };
  }
}
