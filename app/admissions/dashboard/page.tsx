import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, XCircle, AlertCircle, Download, FileText, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyApplications, getApplicationPaymentMap } from "@/lib/actions/admissions";
import { getPaymentConfig } from "@/lib/actions/payments";
import { getUser } from "@/lib/auth/helpers";
import { REQUIRED_DOCUMENTS } from "@/lib/utils/constants";
import type { ApplicationStatus, DocsChecklist } from "@/lib/supabase/types";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  draft:        { label: "Draft",        icon: Clock,         color: "text-gray-600",  bg: "bg-gray-100"  },
  submitted:    { label: "Submitted",    icon: Clock,         color: "text-blue-700",  bg: "bg-blue-100"  },
  under_review: { label: "Under Review", icon: AlertCircle,   color: "text-purple-700",bg: "bg-purple-100"},
  waitlisted:   { label: "Waitlisted",   icon: PauseCircle,   color: "text-orange-700",bg: "bg-orange-100"},
  approved:     { label: "Approved",     icon: CheckCircle,   color: "text-green-700", bg: "bg-green-100" },
  rejected:     { label: "Rejected",     icon: XCircle,       color: "text-red-700",   bg: "bg-red-100"   },
};

const TIMELINE_STEPS: { key: ApplicationStatus; label: string }[] = [
  { key: "submitted",    label: "Application Submitted"  },
  { key: "under_review", label: "Under Review"           },
  { key: "approved",     label: "Decision Made"          },
];

function timelineIndex(status: ApplicationStatus) {
  const order: ApplicationStatus[] = ["draft","submitted","under_review","waitlisted","approved","rejected"];
  return order.indexOf(status);
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/admissions/dashboard");

  const result = await getMyApplications();
  const applications = result.ok ? result.data : [];
  const paymentCfg = await getPaymentConfig();
  const paymentMap = await getApplicationPaymentMap(applications.map((a) => a.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2660]">My Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Track your admission status in real time</p>
        </div>
        <Button asChild className="bg-[#0D2660] hover:bg-[#071540] text-white">
          <Link href="/admissions/apply">New Application</Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-blue-100">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No applications yet</h2>
          <p className="text-gray-400 text-sm mb-6">Start your admission journey today.</p>
          <Button asChild className="bg-[#0D2660] text-white">
            <Link href="/admissions/apply">Apply Now</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.draft;
            const Icon = cfg.icon;
            const checklist = app.docs_checklist as DocsChecklist | null;
            const uploadedCount = checklist
              ? Object.values(checklist).filter(d => d.status === "submitted" || d.status === "approved").length
              : 0;
            const statusIdx = timelineIndex(app.status);

            return (
              <Card key={app.id} className="border-blue-100 shadow-sm overflow-hidden">
                {/* Top bar */}
                <div className="navy-gradient px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#F5C200] font-bold text-lg">{app.application_no ?? "Draft"}</p>
                    <p className="text-blue-300 text-xs">Academic Year: {app.academic_year}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                    <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Programme */}
                  {app.program_data && (
                    <div className="mb-6">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Programme Applied</p>
                      <p className="font-semibold text-[#0D2660]">
                        {(app.program_data as { program_name?: string }).program_name ?? "—"}
                      </p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Application Timeline</p>
                    <div className="flex items-center gap-0">
                      {TIMELINE_STEPS.map((ts, i) => {
                        const done   = timelineIndex(ts.key) <= statusIdx;
                        const active = ts.key === app.status ||
                          (ts.key === "approved" && (app.status === "approved" || app.status === "rejected" || app.status === "waitlisted"));
                        return (
                          <div key={ts.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                done
                                  ? "bg-[#0D2660] border-[#0D2660] text-white"
                                  : "bg-white border-gray-300 text-gray-400"
                              }`}>
                                {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                              </div>
                              <p className={`text-[10px] mt-1 text-center ${done ? "text-[#0D2660] font-medium" : "text-gray-400"}`}>
                                {ts.label}
                              </p>
                            </div>
                            {i < TIMELINE_STEPS.length - 1 && (
                              <div className={`h-0.5 flex-1 -mt-4 ${done ? "bg-[#0D2660]" : "bg-gray-200"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decision reason */}
                  {app.decision_reason && (
                    <div className={`rounded-xl p-4 mb-5 text-sm ${
                      app.status === "approved"   ? "bg-green-50 border border-green-200 text-green-800" :
                      app.status === "rejected"   ? "bg-red-50 border border-red-200 text-red-800"       :
                      "bg-orange-50 border border-orange-200 text-orange-800"
                    }`}>
                      <strong>Admissions Note:</strong> {app.decision_reason}
                    </div>
                  )}

                  {/* Documents summary */}
                  <div className="border border-blue-100 rounded-xl p-4 mb-5">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold text-[#0D2660]">Documents</p>
                      <span className="text-xs text-gray-400">{uploadedCount}/{REQUIRED_DOCUMENTS.length} uploaded</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {REQUIRED_DOCUMENTS.map((doc) => {
                        const docState = checklist?.[doc.type];
                        const ok = docState?.status === "submitted" || docState?.status === "approved";
                        return (
                          <div key={doc.type} className={`flex items-center gap-1.5 text-xs p-2 rounded-lg ${ok ? "bg-green-50" : "bg-gray-50"}`}>
                            <div className={`w-2 h-2 rounded-full shrink-0 ${ok ? "bg-green-500" : "bg-amber-400"}`} />
                            <span className="truncate text-gray-600">{doc.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {app.status === "draft" && (
                      <Button asChild className="bg-[#0D2660] text-white">
                        <Link href="/admissions/application-form">Continue Application</Link>
                      </Button>
                    )}
                    {app.status !== "draft" && (
                      <Button
                        asChild
                        variant="outline"
                        className="border-[#0D2660] text-[#0D2660] gap-2"
                      >
                        <a href={`/api/admissions/pdf?id=${app.id}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" /> Download Form
                        </a>
                      </Button>
                    )}
                    {paymentCfg.required && paymentMap[app.id] && app.status !== "draft" && (
                      <Button
                        asChild
                        variant="outline"
                        className="border-green-700 text-green-800 gap-2"
                      >
                        <a href={`/api/payments/receipt?application_id=${app.id}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" /> Payment Receipt
                        </a>
                      </Button>
                    )}
                    <p className="text-xs text-gray-400 self-center ml-auto">
                      {app.submitted_at
                        ? `Submitted ${new Date(app.submitted_at).toLocaleDateString("en-IN")}`
                        : `Last saved ${new Date(app.updated_at).toLocaleDateString("en-IN")}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
