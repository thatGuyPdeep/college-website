import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimitResponse } from "@/lib/security/rate-limit";
import { ERP_ROLES } from "@/lib/auth/roles";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimitResponse(`upload:erp:${clientIp(req)}`, 15, 60_000);
    if (limited) return limited;

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = (profile as { role?: string } | null)?.role;
    if (!role || !ERP_ROLES.includes(role as typeof ERP_ROLES[number])) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const form = await req.formData();
    const assignment_id = form.get("assignment_id") as string | null;
    const file = form.get("file") as File | null;

    if (!assignment_id || !file) {
      return NextResponse.json({ error: "Missing assignment_id or file" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed. Use PDF, JPG, PNG, or DOC/DOCX." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large. Maximum size is 10 MB." }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = adminClient as any;

    const { data: assignment } = await db
      .from("assignments")
      .select("id, due_at")
      .eq("id", assignment_id)
      .single();

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (assignment.due_at && new Date(assignment.due_at) < new Date()) {
      return NextResponse.json({ error: "Submission deadline has passed" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const safeName = `${assignment_id.slice(0, 8)}-${Date.now()}.${ext}`;
    const file_path = `${user.id}/${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await db.storage
      .from("erp-submissions")
      .upload(file_path, buffer, { contentType: file.type, upsert: true });

    if (uploadErr) {
      console.error("[erp/upload]", uploadErr);
      return NextResponse.json({ error: uploadErr.message ?? "Upload failed" }, { status: 500 });
    }

    const { error: subErr } = await db.from("assignment_submissions").upsert(
      {
        assignment_id,
        user_id:      user.id,
        file_path,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "assignment_id,user_id" }
    );

    if (subErr) {
      return NextResponse.json({ error: subErr.message ?? "Could not save submission" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, file_path });
  } catch (err) {
    console.error("[erp/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
