import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";
import { ADMIN_ROLES, STAFF_ROLES } from "@/lib/auth/roles";

export { ADMIN_ROLES, STAFF_ROLES };

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!allowedRoles.includes((profile as any).role as UserRole)) redirect("/");
  return profile;
}
