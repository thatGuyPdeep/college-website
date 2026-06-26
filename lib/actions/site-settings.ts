"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";
import type { SeatRow } from "@/lib/content/academic-ops";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const SEAT_MATRIX_KEY = "seat_matrix_overrides";

export type SeatMatrixOverrides = {
  ug?: Record<string, Partial<SeatRow>>;
  session?: string;
  notes?: string;
};

async function requireSeatEditor() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!can(role, "admissions", "edit") && !can(role, "content", "edit")) {
    throw new Error("Insufficient permissions");
  }
  return { user };
}

export async function getSeatMatrixOverrides(): Promise<SeatMatrixOverrides> {
  try {
    const { data } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", SEAT_MATRIX_KEY)
      .maybeSingle();
    return (data?.value ?? {}) as SeatMatrixOverrides;
  } catch {
    return {};
  }
}

export async function saveSeatMatrixOverrides(
  overrides: SeatMatrixOverrides,
): Promise<ActionResult<void>> {
  try {
    const { user } = await requireSeatEditor();
    const { error } = await admin.from("site_settings").upsert({
      key:        SEAT_MATRIX_KEY,
      value:      overrides,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    });
    if (error) throw error;
    revalidatePath("/admissions/seats");
    revalidatePath("/admin/admissions/seats");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
