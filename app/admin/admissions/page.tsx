import { Suspense } from "react";
import Link from "next/link";
import { Download, FileText, CheckCircle, XCircle, Clock, AlertCircle, PauseCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listApplications, getAdmissionStats } from "@/lib/actions/admin-admissions";
import { requireRole } from "@/lib/auth/helpers";
import { AdmissionsSearchBar } from "@/components/admin/AdmissionsSearchBar";
import type { ApplicationStatus, ApplicationView } from "@/lib/supabase/types";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string }> = {
  draft:        { label: "Draft",        color: "bg-gray-100 text-gray-700"    },
  submitted:    { label: "Submitted",    color: "bg-blue-100 text-blue-800"    },
  under_review: { label: "Under Review", color: "bg-purple-100 text-purple-800"},
  waitlisted:   { label: "Waitlisted",   color: "bg-orange-100 text-orange-800"},
  approved:     { label: "Approved",     color: "bg-green-100 text-green-800"  },
  rejected:     { label: "Rejected",     color: "bg-red-100 text-red-800"      },
};

async function AdminAdmissionsContent({ status, search }: { status?: ApplicationStatus; search?: string }) {
  const [listResult, statsResult] = await Promise.all([
    listApplications({ status, search, limit: 100 }),
    getAdmissionStats(),
  ]);

  const apps   = listResult.ok  ? listResult.data  : [];
  const stats  = statsResult.ok ? statsResult.data : null;

  return (
    <>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total",        value: stats.total,        icon: FileText,    color: "text-gray-700",   bg: "bg-gray-50"    },
            { label: "Submitted",    value: stats.submitted,    icon: Clock,       color: "text-blue-700",   bg: "bg-blue-50"    },
            { label: "Under Review", value: stats.under_review, icon: AlertCircle, color: "text-purple-700", bg: "bg-purple-50"  },
            { label: "Waitlisted",   value: stats.waitlisted,   icon: PauseCircle, color: "text-orange-700", bg: "bg-orange-50"  },
            { label: "Approved",     value: stats.approved,     icon: CheckCircle, color: "text-green-700",  bg: "bg-green-50"   },
            { label: "Rejected",     value: stats.rejected,     icon: XCircle,     color: "text-red-700",    bg: "bg-red-50"     },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white shadow-sm`}>
              <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "All",          href: "/admin/admissions"                     },
          { label: "Submitted",    href: "/admin/admissions?status=submitted"    },
          { label: "Under Review", href: "/admin/admissions?status=under_review" },
          { label: "Approved",     href: "/admin/admissions?status=approved"     },
          { label: "Rejected",     href: "/admin/admissions?status=rejected"     },
        ].map((f) => (
          <Link
            key={f.label}
            href={f.href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              (status ? f.href.includes(status) : f.href === "/admin/admissions")
                ? "bg-[#0D2660] text-white border-[#0D2660]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660] hover:text-[#0D2660]"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Suspense fallback={null}>
        <AdmissionsSearchBar defaultQuery={search} />
      </Suspense>

      {/* Table */}
      {apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-blue-100">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="navy-gradient text-white">
                  <th className="text-left px-4 py-3 font-semibold text-xs">App No</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs">Applicant</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs">Programme</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs">Submitted</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {apps.map((app: ApplicationView) => {
                  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.draft;
                  const pd = app.personal_data as { full_name?: string; email?: string; phone?: string } | null;
                  return (
                    <tr key={app.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#C8201A] font-bold whitespace-nowrap">
                        {app.application_no ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{pd?.full_name ?? app.applicant_name ?? "—"}</div>
                        <div className="text-xs text-gray-400">{pd?.email ?? app.applicant_email ?? ""}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs max-w-[200px] truncate">
                        {app.program_name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {app.submitted_at
                          ? new Date(app.submitted_at).toLocaleDateString("en-IN")
                          : "Not submitted"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/api/admissions/pdf?id=${app.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="text-xs border-blue-200 text-[#0D2660] gap-1">
                              <Download className="h-3 w-3" /> Form
                            </Button>
                          </Link>
                          <Link href={`/admin/admissions/${app.id}`}>
                            <Button size="sm" className="text-xs bg-[#0D2660] text-white hover:bg-[#071540]">
                              Review
                            </Button>
                          </Link>
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

export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: ApplicationStatus; q?: string }>;
}) {
  await requireRole(["admissions_staff", "admin", "super_admin"]);
  const { status, q } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2660]">Admissions Console</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage all student applications</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2">
            <a href="/api/admin/export?type=admissions" download>
              <Download className="h-4 w-4" /> Export Excel
            </a>
          </Button>
          <Button asChild variant="outline" className="border-gray-300 text-gray-600 gap-2">
            <a href="/api/admin/export?type=admissions&status=submitted" download>
              <Download className="h-4 w-4" /> Export Submitted
            </a>
          </Button>
        </div>
      </div>

      <Suspense fallback={
        <div className="text-center py-20 text-gray-400">Loading applications…</div>
      }>
        <AdminAdmissionsContent status={status} search={q} />
      </Suspense>
    </div>
  );
}
