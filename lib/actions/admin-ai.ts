"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";

const AI_ADMIN_ROLES = ["admin", "super_admin"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requireAiAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profile || !AI_ADMIN_ROLES.includes((profile as any).role)) {
    throw new Error("Insufficient permissions");
  }
}

export type ChatLogRow = {
  id: string;
  session_id: string;
  question: string;
  answer: string | null;
  sources: string[] | null;
  created_at: string;
};

export async function listChatLogs(limit = 50): Promise<ActionResult<ChatLogRow[]>> {
  try {
    await requireAiAdmin();
    const { data, error } = await admin
      .from("ai_chat_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { ok: true, data: (data ?? []) as ChatLogRow[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load chat logs" };
  }
}

export async function getChatAnalytics(): Promise<ActionResult<{
  total: number;
  last7Days: number;
  topQuestions: { question: string; count: number }[];
}>> {
  try {
    await requireAiAdmin();
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data, error } = await admin
      .from("ai_chat_logs")
      .select("question, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;

    const rows = (data ?? []) as { question: string; created_at: string }[];
    const freq = new Map<string, number>();
    for (const r of rows) {
      const key = r.question.trim().toLowerCase().slice(0, 120);
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
    const topQuestions = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }));

    return {
      ok: true,
      data: {
        total:        rows.length,
        last7Days:    rows.filter((r) => r.created_at >= since).length,
        topQuestions,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Analytics failed" };
  }
}
