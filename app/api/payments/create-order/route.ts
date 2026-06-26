import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { getApplicationFeeInr, isOperationalPaymentRequired } from "@/lib/config/operational-settings";
import { clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

const adminClient = _adminClient as ReturnType<typeof import("@supabase/supabase-js").createClient>;

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimitResponse(`payments:order:${clientIp(req)}`, 10, 60_000);
    if (limited) return limited;

    if (!(await isOperationalPaymentRequired())) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { application_id } = await req.json() as { application_id: string };
    if (!application_id) return NextResponse.json({ error: "Missing application_id" }, { status: 400 });

    const { data: app } = await supabase
      .from("applications")
      .select("id, status")
      .eq("id", application_id)
      .eq("applicant_id", user.id)
      .eq("status", "draft")
      .single();

    if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const feeInr = await getApplicationFeeInr();
    const order = await createRazorpayOrder(feeInr, `app-${application_id.slice(0, 8)}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from("payments").upsert({
      application_id,
      amount:            feeInr,
      gateway:           "razorpay",
      gateway_ref:       order.id,
      razorpay_order_id: order.id,
      status:            "created",
    }, { onConflict: "gateway_ref" });

    return NextResponse.json({
      order_id: order.id,
      amount:   feeInr,
      currency: "INR",
      key_id:   process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[payments/create-order]", err);
    return NextResponse.json({ error: "Could not create payment order" }, { status: 500 });
  }
}
