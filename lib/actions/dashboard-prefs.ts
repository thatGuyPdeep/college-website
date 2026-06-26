"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";
import type { DashboardPrefs } from "@/lib/admin/dashboard-widget-order";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export async function getDashboardPrefs(userId: string): Promise<DashboardPrefs> {
  try {
    const { data } = await admin
      .from("profiles")
      .select("dashboard_prefs")
      .eq("id", userId)
      .maybeSingle();
    return (data?.dashboard_prefs ?? {}) as DashboardPrefs;
  } catch {
    return {};
  }
}

export async function saveDashboardPrefs(prefs: DashboardPrefs): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { ok: false, error: "Not authenticated" };

    const { error: updErr } = await admin
      .from("profiles")
      .update({ dashboard_prefs: prefs })
      .eq("id", user.id);

    if (updErr) throw updErr;
    revalidatePath("/admin");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
