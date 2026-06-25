import Link from "next/link";
import { requirePermission } from "@/lib/auth/helpers";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { UniversityBanner } from "@/components/admin/UniversityBanner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export default async function AdminCompliancePage() {
  await requirePermission("compliance", "view");

  const { data: enquiries } = await admin
    .from("contact_enquiries")
    .select("id, subject, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = enquiries ?? [];
  const grievances = list.filter((e: { subject: string; message: string }) =>
    /grievance|ragging|icc|anti-ragging|rti/i.test(`${e.subject} ${e.message}`),
  );
  const rti = list.filter((e: { subject: string; message: string }) =>
    /rti|right to information/i.test(`${e.subject} ${e.message}`),
  );

  const STATUTORY_LINKS = [
    { label: "Anti-Ragging Cell", href: "/cells/anti-ragging" },
    { label: "ICC / Women's Cell", href: "/cells/icc" },
    { label: "RTI", href: "/rti" },
    { label: "Grievance Redressal", href: "/grievance" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Compliance Hub</h1>
      <p className="text-sm text-gray-500 mb-6">RTI, anti-ragging, ICC, and grievance oversight</p>

      <UniversityBanner />

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-blue-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-red-700">{grievances.length}</div>
          <div className="text-sm text-gray-500">Grievance / ragging related</div>
          <Link href="/admin/contact?grievance=1" className="text-xs text-[#0D2660] underline mt-2 inline-block">
            Open queue
          </Link>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-[#0D2660]">{rti.length}</div>
          <div className="text-sm text-gray-500">RTI-related enquiries</div>
          <Link href="/admin/contact" className="text-xs text-[#0D2660] underline mt-2 inline-block">
            View contact log
          </Link>
        </div>
      </div>

      <h2 className="font-semibold text-gray-900 mb-3">Statutory cell pages</h2>
      <ul className="flex flex-wrap gap-2 mb-10">
        {STATUTORY_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm px-3 py-1.5 rounded-lg border border-blue-100 hover:border-[#0D2660]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold text-gray-900 mb-4">Recent compliance-related messages</h2>
      {grievances.length === 0 ? (
        <p className="text-sm text-gray-400">No flagged messages in the contact log.</p>
      ) : (
        <ul className="bg-white border border-blue-100 rounded-xl divide-y divide-blue-50">
          {grievances.slice(0, 15).map((e: { id: string; subject: string; status: string; created_at: string }) => (
            <li key={e.id} className="px-5 py-4">
              <div className="font-medium text-gray-900">{e.subject}</div>
              <p className="text-xs text-gray-400 mt-1">
                {e.status} · {new Date(e.created_at).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
