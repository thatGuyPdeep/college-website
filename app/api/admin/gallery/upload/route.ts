import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

const EDITOR_ROLES = ["content_editor", "admin", "super_admin"];
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimitResponse(`upload:gallery:${clientIp(req)}`, 30, 60_000);
    if (limited) return limited;

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!profile || !EDITOR_ROLES.includes((profile as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, or WebP images allowed" }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "Max 5 MB" }, { status: 400 });
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).storage
      .from("gallery-photos")
      .upload(path, buf, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[gallery/upload]", error);
      return NextResponse.json({ error: error.message ?? "Upload failed" }, { status: 500 });
    }

    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
    const publicUrl = `${base}/storage/v1/object/public/gallery-photos/${path}`;

    return NextResponse.json({ ok: true, path, publicUrl });
  } catch (err) {
    console.error("[gallery/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
