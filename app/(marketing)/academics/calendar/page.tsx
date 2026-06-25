import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { Badge } from "@/components/ui/badge";
import {
  ACADEMIC_CALENDAR,
  ACADEMIC_SESSION,
  CALENDAR_CATEGORY_LABELS,
} from "@/lib/content/academic-ops";

export const metadata: Metadata = {
  title: "Academic Calendar",
  description: `Academic calendar for session ${ACADEMIC_SESSION} — Ramakrishna Mission Vivekananda College, Narayanpur.`,
};

const CATEGORY_STYLES: Record<string, string> = {
  admission:   "border-green-200 text-green-800 bg-green-50",
  academic:    "border-blue-200 text-[#0D2660] bg-blue-50",
  examination: "border-amber-200 text-amber-900 bg-amber-50",
  holiday:     "border-gray-200 text-gray-600 bg-gray-50",
};

export default function AcademicCalendarPage() {
  return (
    <MarketingPage
      title="Academic Calendar"
      hindiTitle="शैक्षणिक कैलेंडर"
      description={`Key dates for session ${ACADEMIC_SESSION} — admissions, semester schedule, and examinations affiliated to Bastar University.`}
      breadcrumbs={[{ label: "Academics", href: "/academics" }]}
    >
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        Dates are indicative and may be revised per Bastar University notifications. For the latest circulars, see{" "}
        <Link href="/news?category=Notice" className="text-[#C8201A] font-semibold hover:underline">
          Notices &amp; Circulars
        </Link>
        .
      </p>

      <div className="overflow-x-auto rounded-2xl border border-blue-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0D2660] text-white text-left">
              <th className="px-4 py-3 font-semibold">Activity</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">From</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {ACADEMIC_CALENDAR.map((entry) => (
              <tr key={entry.title} className="hover:bg-blue-50/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{entry.title}</div>
                  {entry.titleHi && (
                    <div className="text-xs text-gray-500 mt-0.5">{entry.titleHi}</div>
                  )}
                  <Badge
                    variant="outline"
                    className={`mt-2 sm:hidden text-xs ${CATEGORY_STYLES[entry.category]}`}
                  >
                    {CALENDAR_CATEGORY_LABELS[entry.category]}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge variant="outline" className={`text-xs ${CATEGORY_STYLES[entry.category]}`}>
                    {CALENDAR_CATEGORY_LABELS[entry.category]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{entry.from}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{entry.to ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/admissions/seats" className="text-[#0D2660] font-semibold hover:underline">
          Seats Availability →
        </Link>
        <Link href="/examination/timetables" className="text-[#0D2660] font-semibold hover:underline">
          Examination Time Tables →
        </Link>
        <Link href="/nep-2020" className="text-[#0D2660] font-semibold hover:underline">
          NEP 2020 →
        </Link>
      </div>
    </MarketingPage>
  );
}
