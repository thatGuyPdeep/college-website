"use server";

import { revalidatePath } from "next/cache";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { STAFF_DIRECTORY, type StaffMember } from "@/lib/content/staff-directory";
import { requirePermission } from "@/lib/auth/helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

const STAFF_DIRECTORY_KEY = "staff_directory";

export async function getStaffDirectory(): Promise<StaffMember[]> {
  try {
    const { data } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", STAFF_DIRECTORY_KEY)
      .maybeSingle();

    const items = (data?.value as { items?: StaffMember[] } | null)?.items;
    if (items?.length) return items;
  } catch {
    /* fallback */
  }
  return STAFF_DIRECTORY;
}

export async function saveStaffDirectory(items: StaffMember[]) {
  await requirePermission("content", "edit");

  const { error } = await admin.from("site_settings").upsert({
    key: STAFF_DIRECTORY_KEY,
    value: { items },
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/people/staff");
  revalidatePath("/admin/hr");
  return { ok: true as const };
}
