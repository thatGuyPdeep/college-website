import Link from "next/link";
import { Suspense } from "react";
import { Download, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listFacultyApplications, getRecruitmentStats } from "@/lib/actions/admin-recruitment";
import { requireRole } from "@/lib/auth/helpers";
import { RecruitmentActions } from "@/components/admin/RecruitmentActions";
import { VacancyEditor } from "@/components/admin/VacancyEditor";
import { RecruitmentVacancyFilter } from "@/components/admin/RecruitmentVacancyFilter";
import { listAdminVacancies } from "@/lib/actions/admin-vacancies";
import type { FacultyAppStatus } from "@/lib/supabase/types";

function recruitmentExportUrl(format: string, status?: FacultyAppStatus, vacancyId?: string) {
  const q = new URLSearchParams({ type: "recruitment", format });
  if (status) q.set("status", status);
  if (vacancyId) q.set("vacancy_id", vacancyId);
  return `/api/admin/export?${q.toString()}`;
}

function recruitmentFilterHref(status?: FacultyAppStatus, vacancyId?: string, nextStatus?: FacultyAppStatus | null) {
  const q = new URLSearchParams();
  if (nextStatus) q.set("status", nextStatus);
  if (vacancyId) q.set("vacancy_id", vacancyId);
  const qs = q.toString();
  return `/admin/recruitment${qs ? `?${qs}` : ""}`;
}

const STATUS_COLORS: Record<FacultyAppStatus, string> = {
  submitted:   "bg-blue-100 text-blue-800",
  shortlisted: "bg-green-100 text-green-800",
  interview:   "bg-purple-100 text-purple-800",
  rejected:    "bg-red-100 text-red-800",
};

async function RecruitmentContent({
  status,
  vacancyId,
}: {
  status?: FacultyAppStatus;
  vacancyId?: string;
}) {
  const [listResult, statsResult] = await Promise.all([
    listFacultyApplications({ status, vacancy_id: vacancyId }),
    getRecruitmentStats(),
  ]);
  const apps  = listResult.ok  ? listResult.data  : [];
  const stats = statsResult.ok ? statsResult.data : null;

  return (
    <>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Open Vacancies", value: stats.open },
            { label: "Submitted",      value: stats.submitted },
            { label: "Shortlisted",    value: stats.shortlisted },
            { label: "Interview",      value: stats.interview },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-[#0D2660]">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "All", href: recruitmentFilterHref(status, vacancyId, null) },
          { label: "Submitted", href: recruitmentFilterHref(status, vacancyId, "submitted") },
          { label: "Shortlisted", href: recruitmentFilterHref(status, vacancyId, "shortlisted") },
          { label: "Interview", href: recruitmentFilterHref(status, vacancyId, "interview") },
        ].map((f) => (
          <Link key={f.label} href={f.href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              (status ? f.href.includes(`status=${status}`) : f.href === recruitmentFilterHref(undefined, vacancyId, null))
                ? "bg-[#0D2660] text-white border-[#0D2660]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660]"
            }`}>
            {f.label}
          </Link>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-blue-100">
          <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No faculty applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="navy-gradient text-white">
                  <th className="text-left px-4 py-3 text-xs font-semibold">Applicant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Vacancy</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Applied</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {apps.map((app) => {
                  const exp = app.experience as { qualifications?: string; total_exp_years?: number };
                  const cv = app.files.find((f) => f.file_type === "cv");
                  return (
                    <tr key={app.id} className="hover:bg-blue-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{app.applicant_name ?? "—"}</div>
                        <div className="text-xs text-gray-400">{app.applicant_email}</div>
                        <div className="text-xs text-gray-500">{exp.qualifications} · {exp.total_exp_years}y exp</div>
                      </td>
                      <td className="px-4 py-3 text-xs">{app.vacancy_title ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(app.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {cv && (
                            <Button asChild variant="outline" size="sm" className="text-xs gap-1">
                              <a href={`/api/admin/export?type=recruitment&file=${encodeURIComponent(cv.file_path)}`} download>
                                <Download className="h-3 w-3" /> CV
                              </a>
                            </Button>
                          )}
                          <RecruitmentActions id={app.id} status={app.status} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default async function AdminRecruitmentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: FacultyAppStatus; vacancy_id?: string }>;
}) {
  await requireRole(["hr_staff", "admin", "super_admin"]);
  const { status, vacancy_id: vacancyId } = await searchParams;
  const vacResult = await listAdminVacancies();
  const vacancies = vacResult.ok ? vacResult.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2660]">Recruitment Console</h1>
          <p className="text-sm text-gray-500 mt-1">Manage vacancies and review faculty applications</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2">
            <a href={recruitmentExportUrl("xlsx", status, vacancyId)} download>
              <Download className="h-4 w-4" /> Interview List (Excel)
            </a>
          </Button>
          <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2">
            <a href={recruitmentExportUrl("pdf", status, vacancyId)} download>
              <Download className="h-4 w-4" /> Interview List (PDF)
            </a>
          </Button>
          <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2">
            <a href={recruitmentExportUrl("zip", status, vacancyId)} download>
              <Download className="h-4 w-4" /> Download CVs (ZIP)
            </a>
          </Button>
        </div>
      </div>
      <VacancyEditor vacancies={vacancies} />
      <Suspense fallback={null}>
        <RecruitmentVacancyFilter vacancies={vacancies.map((v) => ({ id: v.id, title: v.title, status: v.status }))} />
      </Suspense>
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading…</div>}>
        <RecruitmentContent status={status} vacancyId={vacancyId} />
      </Suspense>
    </div>
  );
}
