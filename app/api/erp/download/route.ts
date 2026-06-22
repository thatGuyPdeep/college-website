import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { ERP_ADMIN_ROLES } from "@/lib/auth/roles";

/**
 * GET /api/erp/download?submission_id=...
 * Returns a short-lived signed URL for faculty/admin to download a submission.
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
    if (!role || !ERP_ADMIN_ROLES.includes(role as typeof ERP_ADMIN_ROLES[number])) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const submissionId = req.nextUrl.searchParams.get("submission_id");
    if (!submissionId) {
      return NextResponse.json({ error: "Missing submission_id" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

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
