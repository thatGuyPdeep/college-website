import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { generatePaymentReceiptPdf } from "@/lib/pdf/generate-payment-receipt";
import type { PersonalData } from "@/lib/supabase/types";

/** GET /api/payments/receipt?application_id=... */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applicationId = req.nextUrl.searchParams.get("application_id");
    if (!applicationId) {
      return NextResponse.json({ error: "Missing application_id" }, { status: 400 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const isStaff = ["admissions_staff", "admin", "super_admin"]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .includes((profile as any)?.role);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

    const { data: app } = await db
      .from("applications")
      .select("id, application_no, applicant_id, personal_data")
      .eq("id", applicationId)
      .single();

    if (!app || (!isStaff && app.applicant_id !== user.id)) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const { data: payment } = await db
      .from("payments")
      .select("amount, status, razorpay_order_id, razorpay_payment_id, updated_at, created_at")
      .eq("application_id", applicationId)
      .eq("status", "paid")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!payment) {
      return NextResponse.json({ error: "No paid payment found for this application" }, { status: 404 });
    }

    const pd = app.personal_data as PersonalData | null;
    const pdf = await generatePaymentReceiptPdf({
      applicationNo: app.application_no,
      applicantName: pd?.full_name ?? "Applicant",
      amount:        Number(payment.amount),
      paidAt:        payment.updated_at ?? payment.created_at,
      orderId:       payment.razorpay_order_id,
      paymentId:     payment.razorpay_payment_id,
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${app.application_no ?? applicationId.slice(0, 8)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[payments/receipt]", err);
    return NextResponse.json({ error: "Receipt generation failed" }, { status: 500 });
  }
}
