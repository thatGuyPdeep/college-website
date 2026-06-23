import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { SYLLABUS_SUBJECTS, SYLLABUS_SESSION } from "@/lib/content/syllabus";

export const metadata: Metadata = {
  title: "Syllabus",
  description: `UG syllabus FYUGP session ${SYLLABUS_SESSION} — Bastar University programmes at RKM College.`,
};

export default function SyllabusHubPage() {
  return (
    <MarketingPage
      title="Syllabus"
      hindiTitle="पाठ्यक्रम"
      description={`Four-Year Undergraduate Programme (FYUGP) under NEP 2020 — session ${SYLLABUS_SESSION}, affiliated to Bastar University.`}
      breadcrumbs={[{ label: "Academics", href: "/academics" }]}
    >
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        Semester-wise schemes below are summarised from the official Bastar University UG syllabi.
        For the academic calendar and examination schedule, see{" "}
        <Link href="/academics/calendar" className="text-[#C8201A] font-semibold hover:underline">
          Academic Calendar
        </Link>
        .
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {SYLLABUS_SUBJECTS.map((s) => (
          <Link
            key={s.slug}
            href={`/academics/syllabus/${s.slug}`}
            className="group p-6 rounded-2xl border border-blue-100 bg-white card-lift hover:border-[#0D2660]/30"
          >
            <BookOpen className="h-6 w-6 text-[#0D2660] mb-3" aria-hidden="true" />
            <h2 className="font-bold text-[#0D2660] group-hover:text-[#C8201A] transition-colors">{s.name}</h2>
            <p className="text-xs text-gray-500 mt-1">{s.programme}</p>
            <p className="text-sm text-gray-600 mt-3">{s.semesters.length} semesters · Session {s.session}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/nep-2020" className="text-[#0D2660] font-semibold hover:underline">NEP 2020 →</Link>
        <Link href="/academics/departments" className="text-[#0D2660] font-semibold hover:underline">Departments →</Link>
        <Link href="/academics/iti" className="text-[#0D2660] font-semibold hover:underline">ITI Trade Syllabus →</Link>
      </div>
    </MarketingPage>
  );
}
