"use server";

import { createClient } from "@/lib/supabase/server";
import { getOperationalSettings, isOperationalPaymentRequired } from "@/lib/config/operational-settings";
import type { ActionResult } from "@/lib/supabase/types";

export async function getPaymentConfig(): Promise<{
  required: boolean;
  amount: number;
  keyId: string | null;
}> {
  const [required, amount] = await Promise.all([
    isOperationalPaymentRequired(),
    getOperationalSettings().then((s) => s.application_fee_inr),
  ]);
  return {
    required,
    amount,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? null,
  };
}

export async function isApplicationPaid(applicationId: string): Promise<ActionResult<boolean>> {
  try {
    if (!(await isOperationalPaymentRequired())) return { ok: true, data: true };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not authenticated" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("payments")
      .select("status")
      .eq("application_id", applicationId)
      .eq("status", "paid")
      .limit(1);

    return { ok: true, data: (data?.length ?? 0) > 0 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Payment check failed" };
  }
}
