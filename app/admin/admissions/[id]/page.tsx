import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getApplicationForStaff } from "@/lib/actions/admin-admissions";
import { requireRole } from "@/lib/auth/helpers";
import { ApplicationReviewActions } from "@/components/admin/ApplicationReviewActions";
import { REQUIRED_DOCUMENTS } from "@/lib/utils/constants";
import type { ApplicationStatus, DocsChecklist, PersonalData, AcademicData } from "@/lib/supabase/types";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft:        "bg-gray-100 text-gray-700",
  submitted:    "bg-blue-100 text-blue-800",
  under_review: "bg-purple-100 text-purple-800",
  waitlisted:   "bg-orange-100 text-orange-800",
  approved:     "bg-green-100 text-green-800",
  rejected:     "bg-red-100 text-red-800",
};

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admissions_staff", "admin", "super_admin"]);
  const { id } = await params;
  const result = await getApplicationForStaff(id);
  if (!result.ok) notFound();

  const app = result.data;
  const pd  = app.personal_data as PersonalData | null;
  const ad  = app.academic_data as AcademicData | null;
  const docs = app.docs_checklist as DocsChecklist | null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/admin/admissions" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0D2660] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to list
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#0D2660] font-mono">
              {app.application_no ?? "Draft"}
            </h1>
            <Badge className={STATUS_COLORS[app.status]}>{app.status.replace("_", " ")}</Badge>
          </div>
          <p className="text-gray-600">{pd?.full_name ?? app.applicant_name} · {app.program_name}</p>
        </div>
        <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2 shrink-0">
          <a href={`/api/admissions/pdf?id=${app.id}`} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" /> Download Form
          </a>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-blue-100 p-6">
            <h2 className="font-semibold text-[#0D2660] mb-4">Personal Details</h2>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                ["Name", pd?.full_name], ["Email", pd?.email], ["Phone", pd?.phone],
                ["DOB", pd?.dob], ["Gender", pd?.gender], ["Category", pd?.category],
                ["Address", pd?.address], ["Pincode", pd?.pincode],
              ].map(([k, v]) => (
                <div key={k}><dt className="text-gray-400">{k}</dt><dd className="font-medium text-gray-900">{v ?? "—"}</dd></div>
              ))}
            </dl>
          </section>

          {ad && (
            <section className="bg-white rounded-xl border border-blue-100 p-6">
              <h2 className="font-semibold text-[#0D2660] mb-4">Academic Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">10th</h3>
                  <p>{ad.tenth?.board} · {ad.tenth?.year} · {ad.tenth?.percentage}%</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">12th</h3>
                  <p>{ad.twelfth?.board} · {ad.twelfth?.year} · {ad.twelfth?.percentage}%</p>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl border border-blue-100 p-6">
            <h2 className="font-semibold text-[#0D2660] mb-4">Documents</h2>
            <ul className="space-y-2">
              {REQUIRED_DOCUMENTS.map((d) => {
                const item = docs?.[d.type];
                const hasFile = Boolean(item?.file_path);
                return (
                  <li key={d.type} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0 gap-3">
                    <span>{d.label}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item?.status ?? "pending"}
                      </Badge>
                      {hasFile && (
                        <a
                          href={`/api/admin/admissions/document?application_id=${app.id}&doc_type=${encodeURIComponent(d.type)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#0D2660] underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div>
          <ApplicationReviewActions applicationId={app.id} currentStatus={app.status} />
          {app.decision_reason && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <strong>Decision note:</strong> {app.decision_reason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
