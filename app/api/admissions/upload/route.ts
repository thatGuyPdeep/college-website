import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * POST /api/admissions/upload
 * multipart/form-data: application_id, doc_type, file
 * Uploads via service role (no storage RLS needed on client).
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const application_id = form.get("application_id") as string | null;
    const doc_type       = form.get("doc_type") as string | null;
    const file           = form.get("file") as File | null;

    if (!application_id || !doc_type || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Use PDF, JPG, or PNG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: app } = await supabase
      .from("applications")
      .select("id")
      .eq("id", application_id)
      .eq("applicant_id", user.id)
      .single();

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const ext       = file.name.split(".").pop() ?? "bin";
    const safe_name = `${doc_type}-${Date.now()}.${ext}`;
    const file_path = `${user.id}/${application_id}/${safe_name}`;
    const buffer    = Buffer.from(await file.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: uploadErr } = await (adminClient as any).storage
      .from("application-documents")
      .upload(file_path, buffer, {
        contentType: file.type,
        upsert:      true,
      });

    if (uploadErr) {
      console.error("[upload] storage error:", uploadErr);
      return NextResponse.json({ error: uploadErr.message ?? "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, file_path });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
