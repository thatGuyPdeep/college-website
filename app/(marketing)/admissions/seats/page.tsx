import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { ITI_ADMISSION_PRIORITY } from "@/lib/content/iti";
import { AdmissionsStatsStrip } from "@/components/marketing/AdmissionsStatsStrip";
import { ADMISSIONS_STATS_AS_OF } from "@/lib/content/admissions-2026";
import { getPublicSeatMatrix } from "@/lib/content/seat-matrix-data";
import type { SeatRow } from "@/lib/content/academic-ops";

export const metadata: Metadata = {
  title: "Seats Availability",
  description: "Programme-wise seat availability for the current academic session.",
};

function SeatTable({
  rows,
  columns,
}: {
  rows: SeatRow[];
  columns: { key: keyof SeatRow; label: string; hideSm?: boolean }[];
}) {  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-100 mb-10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0D2660] text-white text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold ${col.hideSm ? "hidden md:table-cell" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-50">
          {rows.map((row) => (
            <tr key={row.programme} className="hover:bg-blue-50/50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-gray-700 ${col.hideSm ? "hidden md:table-cell" : ""}`}
                >
                  {String(row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function SeatsAvailabilityPage() {
  const matrix = await getPublicSeatMatrix();

  return (
    <MarketingPage
      title="Seats Availability"
      hindiTitle="सीट उपलब्धता"
      description={`Programme-wise sanctioned intake for session ${matrix.session}. ITI figures are NCVT-affiliated; UG intake follows Bastar University notification.`}
      breadcrumbs={[{ label: "Admissions", href: "/admissions" }]}
    >
      <AdmissionsStatsStrip compact />

      {matrix.notes && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8">
          {matrix.notes}
        </p>
      )}

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">
          Undergraduate Programmes (FYUGP)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Affiliated to Bastar University. Sanctioned intake is published in the university admission
          notification. Applications received column reflects paid online applications as of{" "}
          {ADMISSIONS_STATS_AS_OF} (unique applicants per programme).
        </p>
        <SeatTable
          rows={matrix.ug}          columns={[
            { key: "programme", label: "Programme" },
            { key: "department", label: "Department", hideSm: true },
            { key: "duration", label: "Duration", hideSm: true },
            { key: "sanctioned", label: "Sanctioned Intake" },
            { key: "applicationsReceived", label: "Applications Received" },
            { key: "eligibility", label: "Eligibility", hideSm: true },
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[#0D2660] mb-1">
          ITI Trades (NCVT)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Total sanctioned seats across all trades: <strong>{matrix.itiTotal}</strong> (2 units × 2 shifts).
        </p>
        <SeatTable
          rows={matrix.iti}          columns={[
            { key: "programme", label: "Trade" },
            { key: "duration", label: "Duration" },
            { key: "seatsPerUnit", label: "Seats/Unit" },
            { key: "sanctioned", label: "Total Seats" },
            { key: "eligibility", label: "Eligibility", hideSm: true },
          ]}
        />
        <div className="bg-[#F0F4FF] border border-blue-100 rounded-xl p-5 text-sm text-gray-700">
          <h3 className="font-semibold text-[#0D2660] mb-2">Admission Priority (ITI)</h3>
          <ol className="list-decimal list-inside space-y-1">
            {ITI_ADMISSION_PRIORITY.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p className="mt-3">
            <Link href="/academics/iti" className="text-[#C8201A] font-semibold hover:underline">
              ITI programme details →
            </Link>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">
          Vivekananda Vidyapeeth (Class XI–XII)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Free residential higher-secondary schooling for tribal students. Seat allocation is by
          merit and residential capacity.
        </p>
        <SeatTable
          rows={matrix.vidyapeeth}          columns={[
            { key: "programme", label: "Stream" },
            { key: "level", label: "Level" },
            { key: "duration", label: "Duration" },
            { key: "sanctioned", label: "Mode" },
            { key: "eligibility", label: "Eligibility", hideSm: true },
          ]}
        />
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admissions/apply"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#C8201A] text-white text-sm font-semibold hover:bg-[#9B1812]"
        >
          Apply Online
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[#0D2660] text-[#0D2660] text-sm font-semibold hover:bg-blue-50"
        >
          Contact Admissions Office
        </Link>
      </div>
    </MarketingPage>
  );
}
