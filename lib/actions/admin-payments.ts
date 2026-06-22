"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requirePaymentsAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role;
  if (!profile || !["admissions_staff", "admin", "super_admin"].includes(role)) {
    throw new Error("Insufficient permissions");
  }
}

export type PaymentRow = {
  id: string;
  application_id: string;
  amount: number;
  status: string;
  gateway: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  application_no?: string | null;
  applicant_email?: string | null;
};

export async function listPayments(): Promise<ActionResult<PaymentRow[]>> {
  try {
    await requirePaymentsAdmin();
    const { data, error } = await admin
      .from("payments")
      .select("*, applications(application_no, personal_data)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;

    return {
      ok: true,
      data: ((data ?? []) as Record<string, unknown>[]).map((p) => {
        const app = p.applications as { application_no?: string; personal_data?: { email?: string } } | null;
        return {
          id:                  p.id as string,
          application_id:      p.application_id as string,
          amount:              Number(p.amount),
          status:              p.status as string,
          gateway:             p.gateway as string | null,
          razorpay_order_id:   p.razorpay_order_id as string | null,
          razorpay_payment_id: p.razorpay_payment_id as string | null,
          created_at:          p.created_at as string,
          application_no:      app?.application_no ?? null,
          applicant_email:     app?.personal_data?.email ?? null,
        };
      }),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load payments" };
  }
}
