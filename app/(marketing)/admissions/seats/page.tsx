import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import {
  UG_SEAT_ROWS,
  ITI_SEAT_ROWS,
  VIDYAPEETH_SEAT_ROWS,
  ITI_TOTAL_SEATS,
  ACADEMIC_SESSION,
} from "@/lib/content/academic-ops";
import { ITI_ADMISSION_PRIORITY } from "@/lib/content/iti";

export const metadata: Metadata = {
  title: "Seats Availability",
  description: `Programme-wise seat availability for session ${ACADEMIC_SESSION} — UG, ITI, and Vidyapeeth.`,
};

function SeatTable({
  rows,
  columns,
}: {
  rows: typeof UG_SEAT_ROWS;
  columns: { key: keyof (typeof UG_SEAT_ROWS)[0]; label: string; hideSm?: boolean }[];
}) {
  return (
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

export default function SeatsAvailabilityPage() {
  return (
    <MarketingPage
      title="Seats Availability"
      hindiTitle="सीट उपलब्धता"
      description={`Programme-wise sanctioned intake for session ${ACADEMIC_SESSION}. ITI figures are NCVT-affiliated; UG intake follows Bastar University notification.`}
      breadcrumbs={[{ label: "Admissions", href: "/admissions" }]}
    >
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">
          Undergraduate Programmes (FYUGP)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Affiliated to Bastar University. Sanctioned intake is published in the university admission
          notification — contact the admissions office for the latest figures.
        </p>
        <SeatTable
          rows={UG_SEAT_ROWS}
          columns={[
            { key: "programme", label: "Programme" },
            { key: "department", label: "Department", hideSm: true },
            { key: "duration", label: "Duration", hideSm: true },
            { key: "sanctioned", label: "Sanctioned Intake" },
            { key: "eligibility", label: "Eligibility", hideSm: true },
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[#0D2660] mb-1">
          ITI Trades (NCVT)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Total sanctioned seats across all trades: <strong>{ITI_TOTAL_SEATS}</strong> (2 units × 2 shifts).
        </p>
        <SeatTable
          rows={ITI_SEAT_ROWS}
          columns={[
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
          rows={VIDYAPEETH_SEAT_ROWS}
          columns={[
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
