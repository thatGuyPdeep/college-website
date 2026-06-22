"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";

const adminClient = _adminClient as ReturnType<typeof import("@supabase/supabase-js").createClient>;

async function requireStaff() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role;
  if (!["admin", "super_admin", "admissions_staff"].includes(role)) {
    throw new Error("Insufficient permissions");
  }
  return { user };
}

export interface ContactEnquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export async function listContactEnquiries(filters?: {
  status?: "new" | "read";
  grievance?: boolean;
}): Promise<ActionResult<ContactEnquiry[]>> {
  try {
    await requireStaff();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (adminClient as any)
      .from("contact_enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.grievance) {
      query = query.or("subject.ilike.%grievance%,subject.ilike.%ragging%,message.ilike.%grievance%,message.ilike.%ragging%");
    }
    const { data, error } = await query;
    if (error) throw error;
    return { ok: true, data: (data ?? []) as ContactEnquiry[] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load enquiries" };
  }
}

export async function markEnquiryRead(id: string): Promise<ActionResult<void>> {
  try {
    await requireStaff();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any)
      .from("contact_enquiries")
      .update({ status: "read" })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/contact");
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}
