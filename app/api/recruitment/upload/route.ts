import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

const ALLOWED = ["application/pdf"];
const MAX = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimitResponse(`upload:recruitment:${clientIp(req)}`, 20, 60_000);
    if (limited) return limited;

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const vacancy_id = form.get("vacancy_id") as string | null;
    const file_type  = form.get("file_type") as string | null;
    const file       = form.get("file") as File | null;

    if (!vacancy_id || !file_type || !file) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "Max 5 MB" }, { status: 400 });
    }

    const ext  = file.name.split(".").pop() ?? "pdf";
    const path = `${user.id}/${vacancy_id}/${file_type}-${Date.now()}.${ext}`;
    const buf  = Buffer.from(await file.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).storage
      .from("recruitment-files")
      .upload(path, buf, { contentType: file.type, upsert: true });

    if (error) {
      console.error("[recruitment/upload]", error);
      return NextResponse.json({ error: error.message ?? "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, file_path: path });
  } catch (err) {
    console.error("[recruitment/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
