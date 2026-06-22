import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { adminClient as _adminClient } from "@/lib/supabase/admin";

import ExcelJS from "exceljs";

import type { ApplicationView } from "@/lib/supabase/types";

import type { PersonalData, AcademicData } from "@/lib/supabase/types";

import { buildRecruitmentCvZip } from "@/lib/export/recruitment-cv-zip";

import { generateInterviewListPdf } from "@/lib/pdf/generate-interview-list";

import type { InterviewListRow } from "@/lib/pdf/interview-list";



// eslint-disable-next-line @typescript-eslint/no-explicit-any

const adminClient = _adminClient as any;



const ADMISSIONS_ROLES = ["admissions_staff", "admin", "super_admin"];

const HR_ROLES = ["hr_staff", "admin", "super_admin"];



async function requireStaffRole(roles: string[]) {

  const supabase = await createClient();

  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };



  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  if (!roles.includes((profile as any)?.role)) {

    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };

  }

  return { user };

}



function headerStyle(ws: ExcelJS.Worksheet) {

  const headerFill: ExcelJS.FillPattern = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D2660" } };

  const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };

  ws.getRow(1).eachCell((cell) => {

    cell.fill = headerFill;

    cell.font = headerFont;

    cell.alignment = { vertical: "middle", horizontal: "center" };

  });

  ws.getRow(1).height = 22;

}



async function exportAdmissions(status: string | null) {

  let query = adminClient.from("v_applications").select("*").order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) throw error;



  const apps = (data ?? []) as ApplicationView[];

  const wb = new ExcelJS.Workbook();

  wb.creator = "RKM College Admissions System";

  const ws = wb.addWorksheet("Applications");



  ws.columns = [

    { header: "App No", key: "application_no", width: 18 },

    { header: "Status", key: "status", width: 14 },

    { header: "Full Name", key: "full_name", width: 22 },

    { header: "Email", key: "email", width: 28 },

    { header: "Phone", key: "phone", width: 14 },

    { header: "Programme", key: "program", width: 30 },

    { header: "Submitted At", key: "submitted_at", width: 18 },

  ];



  apps.forEach((a) => {

    const pd = a.personal_data as PersonalData | null;

    ws.addRow({

      application_no: a.application_no ?? "",

      status:         a.status,

      full_name:      pd?.full_name ?? a.applicant_name ?? "",

      email:          pd?.email ?? a.applicant_email ?? "",

      phone:          pd?.phone ?? a.applicant_phone ?? "",

      program:        a.program_name ?? "",

      submitted_at:   a.submitted_at ? new Date(a.submitted_at).toLocaleDateString("en-IN") : "",

    });

  });



  headerStyle(ws);

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: ws.columns.length } };



  const buffer = await wb.xlsx.writeBuffer();

  const filename = `admissions-export-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {

    headers: {

      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition": `attachment; filename="${filename}"`,

    },

  });

}



async function fetchInterviewCandidates(statusFilter?: string | null) {

  let query = adminClient

    .from("faculty_applications")

    .select("id, status, created_at, experience, vacancies(title, designation)")

    .in("status", ["shortlisted", "interview"])

    .order("created_at", { ascending: false });



  if (statusFilter && ["shortlisted", "interview"].includes(statusFilter)) {

    query = adminClient

      .from("faculty_applications")

      .select("id, status, created_at, experience, vacancies(title, designation)")

      .eq("status", statusFilter)

      .order("created_at", { ascending: false });

  }



  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];

}



async function exportRecruitmentInterviewListExcel(statusFilter?: string | null) {

  const data = await fetchInterviewCandidates(statusFilter);



  const wb = new ExcelJS.Workbook();

  const ws = wb.addWorksheet("Interview List");

  ws.columns = [

    { header: "Applicant", key: "name", width: 24 },

    { header: "Email", key: "email", width: 28 },

    { header: "Phone", key: "phone", width: 14 },

    { header: "Vacancy", key: "vacancy", width: 30 },

    { header: "Qualifications", key: "qualifications", width: 24 },

    { header: "Experience (yrs)", key: "exp", width: 14 },

    { header: "Status", key: "status", width: 12 },

    { header: "Applied", key: "applied", width: 14 },

  ];



  for (const row of data) {

    const exp = row.experience as Record<string, unknown>;

    ws.addRow({

      name:           (exp.full_name as string) ?? "",

      email:          (exp.email as string) ?? "",

      phone:          (exp.phone as string) ?? "",

      vacancy:        (row.vacancies as { title?: string } | null)?.title ?? "",

      qualifications: (exp.qualifications as string) ?? "",

      exp:            (exp.total_exp_years as number) ?? "",

      status:         row.status,

      applied:        new Date(row.created_at as string).toLocaleDateString("en-IN"),

    });

  }



  headerStyle(ws);

  const buffer = await wb.xlsx.writeBuffer();

  const filename = `recruitment-interview-list-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {

    headers: {

      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition": `attachment; filename="${filename}"`,

    },

  });

}



async function exportRecruitmentInterviewListPdf(statusFilter?: string | null) {

  const data = await fetchInterviewCandidates(statusFilter);

  const rows: InterviewListRow[] = data.map((row: Record<string, unknown>) => {

    const exp = row.experience as Record<string, unknown>;

    return {

      name:             (exp.full_name as string) ?? "",

      email:            (exp.email as string) ?? "",

      phone:            (exp.phone as string) ?? "",

      vacancy:          (row.vacancies as { title?: string } | null)?.title ?? "",

      qualifications:   (exp.qualifications as string) ?? "",

      experienceYears:  String((exp.total_exp_years as number) ?? ""),

      status:           String(row.status ?? ""),

      applied:          new Date(row.created_at as string).toLocaleDateString("en-IN"),

    };

  });



  const pdf = await generateInterviewListPdf(rows);

  const filename = `recruitment-interview-list-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {

    headers: {

      "Content-Type":        "application/pdf",

      "Content-Disposition": `attachment; filename="${filename}"`,

    },

  });

}



async function exportRecruitmentCvZip(status?: string | null, vacancyId?: string | null) {

  const { buffer, count } = await buildRecruitmentCvZip({

    status:     status ?? undefined,

    vacancy_id: vacancyId ?? undefined,

  });

  const filename = `recruitment-cvs-${new Date().toISOString().slice(0, 10)}.zip`;

  return new NextResponse(new Uint8Array(buffer), {

    headers: {

      "Content-Type":        "application/zip",

      "Content-Disposition": `attachment; filename="${filename}"`,

      "X-CV-Count":          String(count),

    },

  });

}



async function downloadRecruitmentFile(filePath: string) {

  const { data: signed, error: signErr } = await adminClient.storage

    .from("recruitment-files")

    .createSignedUrl(filePath, 120);



  if (signErr || !signed?.signedUrl) {

    return NextResponse.json({ error: signErr?.message ?? "File not found" }, { status: 404 });

  }

  return NextResponse.redirect(signed.signedUrl);

}



/**

 * GET /api/admin/export?type=admissions|recruitment

 * GET /api/admin/export?type=recruitment&file=<storage_path>  — signed CV download

 * GET /api/admin/export?type=recruitment&format=pdf|xlsx|zip

 * GET /api/admin/export?type=recruitment&format=zip&status=submitted

 */

export async function GET(req: NextRequest) {

  try {

    const type = req.nextUrl.searchParams.get("type") ?? "admissions";

    const file = req.nextUrl.searchParams.get("file");

    const format = req.nextUrl.searchParams.get("format") ?? "xlsx";

    const status = req.nextUrl.searchParams.get("status");

    const vacancyId = req.nextUrl.searchParams.get("vacancy_id");



    if (type === "recruitment") {

      const auth = await requireStaffRole(HR_ROLES);

      if (auth.error) return auth.error;



      if (file) return downloadRecruitmentFile(decodeURIComponent(file));

      if (format === "zip") return exportRecruitmentCvZip(status, vacancyId);

      if (format === "pdf") return exportRecruitmentInterviewListPdf(status);

      return exportRecruitmentInterviewListExcel(status);

    }



    const auth = await requireStaffRole(ADMISSIONS_ROLES);

    if (auth.error) return auth.error;



    return exportAdmissions(status);

  } catch (err) {

    console.error("[export] error:", err);

    const message = err instanceof Error ? err.message : "Export failed";

    return NextResponse.json({ error: message }, { status: 500 });

  }

}

