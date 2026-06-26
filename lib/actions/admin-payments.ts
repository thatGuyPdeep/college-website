"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

async function requirePaymentsAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!profile || !can(role, "payments", "view")) {
    throw new Error("Insufficient permissions");
  }
  return { user, role };
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

export type PaymentStats = {
  total: number;
  paid: number;
  pending: number;
  failed: number;
  refunded: number;
  revenue: number;
  todayPaid: number;
};

export async function getPaymentStats(): Promise<ActionResult<PaymentStats>> {
  try {
    await requirePaymentsAccess();
    const { data, error } = await admin
      .from("payments")
      .select("status, amount, created_at");
    if (error) throw error;

    const list = data ?? [];
    const today = new Date().toDateString();
    const paidRows = list.filter((p: { status: string }) => p.status === "paid");

    return {
      ok: true,
      data: {
        total:     list.length,
        paid:      paidRows.length,
        pending:   list.filter((p: { status: string }) => p.status === "created").length,
        failed:    list.filter((p: { status: string }) => p.status === "failed").length,
        refunded:  list.filter((p: { status: string }) => p.status === "refunded").length,
        revenue:   paidRows.reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0),
        todayPaid: paidRows.filter(
          (p: { created_at: string }) => new Date(p.created_at).toDateString() === today,
        ).length,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load stats" };
  }
}

export async function listPayments(filters?: {
  status?: string;
  limit?: number;
}): Promise<ActionResult<PaymentRow[]>> {
  try {
    await requirePaymentsAccess();
    let query = admin
      .from("payments")
      .select("*, applications(application_no, personal_data)")
      .order("created_at", { ascending: false })
      .limit(filters?.limit ?? 300);

    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
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

export async function exportPaymentsCsv(): Promise<ActionResult<string>> {
  try {
    const { role } = await requirePaymentsAccess();
    if (!can(role, "payments", "export") && !can(role, "payments", "view")) {
      throw new Error("Cannot export payments");
    }
    const result = await listPayments({ limit: 5000 });
    if (!result.ok) throw new Error(result.error);

    const header = "Date,Application No,Email,Amount,Status,Razorpay Payment ID\n";
    const rows = result.data.map((p) => {
      const cols = [
        new Date(p.created_at).toISOString(),
        p.application_no ?? "",
        p.applicant_email ?? "",
        String(p.amount),
        p.status,
        p.razorpay_payment_id ?? "",
      ];
      return cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
    });

    return { ok: true, data: header + rows.join("\n") };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Export failed" };
  }
}
