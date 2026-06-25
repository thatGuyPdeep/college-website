import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { notifyStaff } from "@/lib/actions/staff-notifications";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type CompletePaymentResult = {
  ok: boolean;
  alreadyPaid?: boolean;
  applicationId?: string;
  error?: string;
};

/** Idempotent mark-as-paid by Razorpay order ID. Used by client verify + webhook. */
export async function markPaymentPaid(
  orderId: string,
  paymentId: string
): Promise<CompletePaymentResult> {
  if (!orderId || !paymentId) {
    return { ok: false, error: "Missing order or payment ID" };
  }

  const { data: payment, error: findErr } = await admin
    .from("payments")
    .select("id, application_id, status, razorpay_order_id, gateway_ref")
    .or(`razorpay_order_id.eq.${orderId},gateway_ref.eq.${orderId}`)
    .maybeSingle();

  if (findErr || !payment) {
    return { ok: false, error: "Payment record not found" };
  }

  if (payment.status === "paid") {
    return { ok: true, alreadyPaid: true, applicationId: payment.application_id };
  }

  const { data: updated, error: updateErr } = await admin
    .from("payments")
    .update({
      status:              "paid",
      razorpay_order_id:   orderId,
      razorpay_payment_id: paymentId,
      gateway_ref:         paymentId,
    })
    .eq("id", payment.id)
    .eq("status", "created")
    .select("application_id")
    .maybeSingle();

  if (updateErr) {
    return { ok: false, error: updateErr.message };
  }

  if (!updated) {
    const { data: recheck } = await admin
      .from("payments")
      .select("status, application_id")
      .eq("id", payment.id)
      .single();
    if (recheck?.status === "paid") {
      return { ok: true, alreadyPaid: true, applicationId: recheck.application_id };
    }
    return { ok: false, error: "Could not update payment status" };
  }

  void import("@/lib/email/payment-receipt")
    .then(({ sendPaymentReceiptEmail }) => sendPaymentReceiptEmail(updated.application_id))
    .catch(() => undefined);

  void notifyStaff({
    type:        "application_payment",
    title:       "Application fee payment received",
    href:        "/admin/payments",
    entity_type: "application",
    entity_id:   updated.application_id,
    target_role: "admissions_staff",
  });

  void notifyStaff({
    type:        "application_payment",
    title:       "Application fee payment received",
    href:        "/admin/payments",
    target_role: "accounts_staff",
  });

  return { ok: true, applicationId: updated.application_id };
}
