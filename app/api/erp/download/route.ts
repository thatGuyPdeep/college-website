import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { ERP_ADMIN_ROLES } from "@/lib/auth/roles";

const HR_ROLES = ["hr_staff", "accounts_staff", "admin", "super_admin"];

/**
 * GET /api/erp/download?submission_id=... | ?salary_slip_id=...
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = (profile as { role?: string } | null)?.role;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

    const salarySlipId = req.nextUrl.searchParams.get("salary_slip_id");
    if (salarySlipId) {
      if (!role || !ERP_ADMIN_ROLES.includes(role as typeof ERP_ADMIN_ROLES[number])) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { data: slip, error: slipErr } = await db
        .from("hr_salary_slips")
        .select("user_id, file_path")
        .eq("id", salarySlipId)
        .single();

      if (slipErr || !slip?.file_path) {
        return NextResponse.json({ error: "Salary slip not found" }, { status: 404 });
      }

      const isOwner = slip.user_id === user.id;
      const isHr = role && HR_ROLES.includes(role);
      if (!isOwner && !isHr) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { data: signed, error: signErr } = await db.storage
        .from("hr-documents")
        .createSignedUrl(slip.file_path, 120);

      if (signErr || !signed?.signedUrl) {
        return NextResponse.json({ error: signErr?.message ?? "Could not generate download link" }, { status: 500 });
      }

      return NextResponse.redirect(signed.signedUrl);
    }

    if (!role || !ERP_ADMIN_ROLES.includes(role as typeof ERP_ADMIN_ROLES[number])) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const submissionId = req.nextUrl.searchParams.get("submission_id");
    if (!submissionId) {
      return NextResponse.json({ error: "Missing submission_id or salary_slip_id" }, { status: 400 });
    }

    const { data: submission, error: subErr } = await db
      .from("assignment_submissions")
      .select("file_path")
      .eq("id", submissionId)
      .single();

    if (subErr || !submission?.file_path) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const { data: signed, error: signErr } = await db.storage
      .from("erp-submissions")
      .createSignedUrl(submission.file_path, 120);

    if (signErr || !signed?.signedUrl) {
      return NextResponse.json({ error: signErr?.message ?? "Could not generate download link" }, { status: 500 });
    }

    return NextResponse.redirect(signed.signedUrl);
  } catch (err) {
    console.error("[erp/download]", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
