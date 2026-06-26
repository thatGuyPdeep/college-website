import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type StaffScopeFilter = {
  programIds: string[] | null;
};

const UNRESTRICTED_ROLES: UserRole[] = [
  "admin", "super_admin", "admissions_staff", "principal",
];

/** Resolve programme IDs a staff member may see for admissions. null = no filter. */
export async function getAdmissionsScopeFilter(
  userId: string,
  role: UserRole,
): Promise<StaffScopeFilter> {
  if (UNRESTRICTED_ROLES.includes(role)) {
    return { programIds: null };
  }

  if (role !== "hod") {
    return { programIds: null };
  }

  const departmentSlugs = new Set<string>();
  const programSlugs = new Set<string>();

  const { data: profile } = await admin
    .from("profiles")
    .select("department_slug")
    .eq("id", userId)
    .single();

  if (profile?.department_slug) {
    departmentSlugs.add(profile.department_slug as string);
  }

  const { data: scopes } = await admin
    .from("staff_scopes")
    .select("scope_type, scope_value")
    .eq("profile_id", userId);

  for (const row of scopes ?? []) {
    if (row.scope_type === "department") departmentSlugs.add(row.scope_value as string);
    if (row.scope_type === "programme") programSlugs.add(row.scope_value as string);
  }

  const programIds = new Set<string>();

  if (programSlugs.size > 0) {
    const { data: bySlug } = await admin
      .from("programs")
      .select("id")
      .in("slug", [...programSlugs]);
    for (const p of bySlug ?? []) programIds.add(p.id as string);
  }

  if (departmentSlugs.size > 0) {
    const { data: depts } = await admin
      .from("departments")
      .select("id")
      .in("slug", [...departmentSlugs]);
    const deptIds = (depts ?? []).map((d: { id: string }) => d.id);
    if (deptIds.length) {
      const { data: byDept } = await admin
        .from("programs")
        .select("id")
        .in("department_id", deptIds);
      for (const p of byDept ?? []) programIds.add(p.id as string);
    }
  }

  return { programIds: [...programIds] };
}
