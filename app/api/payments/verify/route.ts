import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { markPaymentPaid } from "@/lib/payments/complete-payment";
import { clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

/** Client-side payment verification after Razorpay checkout */
export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimitResponse(`payments:verify:${clientIp(req)}`, 20, 60_000);
    if (limited) return limited;

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { application_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json() as {
        application_id: string;
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };

    if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const { data: app } = await supabase
      .from("applications")
      .select("id")
      .eq("id", application_id)
      .eq("applicant_id", user.id)
      .single();

    if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const result = await markPaymentPaid(razorpay_order_id, razorpay_payment_id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? "Verification failed" }, { status: 400 });
    }

    if (result.applicationId && result.applicationId !== application_id) {
      return NextResponse.json({ error: "Payment does not match application" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, alreadyPaid: result.alreadyPaid ?? false });
  } catch (err) {
    console.error("[payments/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
