import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

const STAFF_ROLES = ["admissions_staff", "admin", "super_admin"];

/**
 * GET /api/admin/admissions/document?application_id=&doc_type=
 * Staff signed download from application-documents bucket.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!STAFF_ROLES.includes((profile as any)?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applicationId = req.nextUrl.searchParams.get("application_id");
    const docType = req.nextUrl.searchParams.get("doc_type");
    if (!applicationId || !docType) {
      return NextResponse.json({ error: "Missing application_id or doc_type" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

    const { data: app } = await db
      .from("applications")
      .select("docs_checklist")
      .eq("id", applicationId)
      .single();

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const checklist = app.docs_checklist as Record<string, { file_path?: string | null }> | null;
    const filePath = checklist?.[docType]?.file_path;
    if (!filePath) {
      return NextResponse.json({ error: "Document not uploaded" }, { status: 404 });
    }

    const { data: signed, error: signErr } = await db.storage
      .from("application-documents")
      .createSignedUrl(filePath, 120);

    if (signErr || !signed?.signedUrl) {
      return NextResponse.json({ error: signErr?.message ?? "Could not generate link" }, { status: 500 });
    }

    return NextResponse.redirect(signed.signedUrl);
  } catch (err) {
    console.error("[admin/admissions/document]", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
