import JSZip from "jszip";
import { adminClient as _adminClient } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

function safeName(name: string): string {
  return name.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "_").slice(0, 60) || "applicant";
}

export async function buildRecruitmentCvZip(options?: {
  status?: string;
  vacancy_id?: string;
}): Promise<{ buffer: Buffer; count: number }> {
  let query = admin
    .from("faculty_applications")
    .select("id, status, experience, vacancies(title), faculty_app_files(file_type, file_path)")
    .order("created_at", { ascending: false });

  if (options?.status) query = query.eq("status", options.status);
  if (options?.vacancy_id) query = query.eq("vacancy_id", options.vacancy_id);

  const { data, error } = await query;
  if (error) throw error;

  const zip = new JSZip();
  let count = 0;

  for (const row of data ?? []) {
    const exp = row.experience as Record<string, unknown>;
    const name = safeName((exp.full_name as string) ?? "applicant");
    const files = (row.faculty_app_files as { file_type: string; file_path: string }[]) ?? [];
    const cv = files.find((f) => f.file_type === "cv");
    if (!cv?.file_path) continue;

    const { data: blob, error: dlErr } = await admin.storage
      .from("recruitment-files")
      .download(cv.file_path);

    if (dlErr || !blob) continue;

    const ext = cv.file_path.split(".").pop() ?? "pdf";
    const folder = safeName((row.vacancies as { title?: string } | null)?.title ?? "vacancy");
    zip.file(`${folder}/${name}-cv.${ext}`, Buffer.from(await blob.arrayBuffer()));
    count++;
  }

  if (count === 0) {
    throw new Error("No CV files found for the selected filter");
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return { buffer, count };
}
