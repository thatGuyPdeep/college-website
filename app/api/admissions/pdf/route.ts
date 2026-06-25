import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { generateAdmissionPdf } from "@/lib/pdf/generate-receipt";
import type { Application, PersonalData, AcademicData, ProgramData } from "@/lib/supabase/types";

/**
 * GET /api/admissions/pdf?id=<application_id>&format=pdf|html
 * Returns admission form as PDF (default) or printable HTML.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const format = req.nextUrl.searchParams.get("format") ?? "pdf";

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    const isStaff = ["admissions_staff", "admin", "super_admin"]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .includes((profile as any)?.role);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = isStaff ? adminClient as any : supabase;

    let query = db.from("applications").select("*, programs(name, level, fees)");
    if (!isStaff) query = query.eq("applicant_id", user.id);

    const { data: app, error: appErr } = await query.eq("id", id).single();

    if (appErr || !app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const a = app as Application & { programs?: { name?: string; fees?: number } };

    if (format === "html") {
      const pd = a.personal_data as PersonalData | null;
      const ad = a.academic_data as AcademicData | null;
      const pgd = a.program_data as ProgramData | null;
      const html = buildHtml(a, pd, ad, pgd);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="admission-${a.application_no ?? "draft"}.html"`,
        },
      });
    }

    const pdf = await generateAdmissionPdf(a);
    const filename = `admission-${a.application_no ?? "draft"}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[pdf] error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}

function buildHtml(
  a: Application & { programs?: { name?: string } },
  pd: PersonalData | null,
  ad: AcademicData | null,
  pgd: ProgramData | null
) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>Admission — ${a.application_no ?? "Draft"}</title>
<style>body{font-family:Arial,sans-serif;font-size:11pt;padding:24px;color:#111}h1{text-align:center;color:#0D2660}</style>
</head><body>
<h1>Ramakrishna Mission Vivekananda College, Narayanpur</h1>
<p style="text-align:center"><strong>${a.application_no ?? "DRAFT"}</strong> · ${a.status.toUpperCase()}</p>
<p><strong>Name:</strong> ${pd?.full_name ?? "—"}</p>
<p><strong>Programme:</strong> ${pgd?.program_name ?? a.programs?.name ?? "—"}</p>
<p><strong>10th:</strong> ${ad?.tenth?.board ?? "—"} ${ad?.tenth?.percentage ?? ""}%</p>
</body></html>`;
}
