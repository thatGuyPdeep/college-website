import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import {
  ADMISSIONS_SHORTLIST_FIRST,
  SHORTLIST_COUNT,
  SHORTLIST_META,
} from "@/lib/content/admissions-shortlist-first";
import { ADMISSIONS_SESSION } from "@/lib/content/admissions-2026";

export const metadata: Metadata = {
  title: "1st Shortlist — Admissions",
  description: `First list of shortlisted students for admission session ${ADMISSIONS_SESSION} at Ramakrishna Mission Vivekananda College, Narayanpur.`,
};

const PROGRAMME_ORDER = ["BA", "B.Sc Science", "B.Sc Life Science", "B.Com"];

export default function AdmissionsShortlistPage() {
  const byProgramme = PROGRAMME_ORDER.map((programme) => ({
    programme,
    students: ADMISSIONS_SHORTLIST_FIRST.filter((s) => s.programme === programme),
  })).filter((g) => g.students.length > 0);

  return (
    <>
      <PageHero
        eyebrow={`Admissions ${SHORTLIST_META.session}`}
        title={SHORTLIST_META.title}
        description={`Published ${SHORTLIST_META.publishedAt} · ${SHORTLIST_COUNT} candidates across UG programmes.`}
      />

      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/admissions" className="hover:text-[#0D2660]">Admissions</Link>
            {" / "}
            <span className="text-[#0D2660] font-medium">1st Shortlist</span>
          </nav>

          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            The following candidates appear on the first shortlist for undergraduate admission at
            Ramakrishna Mission Vivekananda College, Narayanpur. Selected candidates should follow
            further instructions from the admissions office and Bastar University portal.
          </p>

          {byProgramme.map(({ programme, students }) => (
            <div key={programme} className="mb-10">
              <h2 className="text-lg font-bold text-[#0D2660] mb-3 pb-2 border-b border-blue-100">
                {programme}
                <span className="ml-2 text-sm font-normal text-gray-500">({students.length})</span>
              </h2>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0D2660] text-white text-left">
                      <th className="px-4 py-3 font-semibold w-12">#</th>
                      <th className="px-4 py-3 font-semibold">Application ID</th>
                      <th className="px-4 py-3 font-semibold">Student name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, idx) => (
                      <tr key={s.applicationId} className={idx % 2 ? "bg-blue-50/40" : "bg-white"}>
                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#0D2660]">{s.applicationId}</td>
                        <td className="px-4 py-3 font-medium">{s.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/admissions"
              className="text-sm font-semibold text-[#0D2660] hover:text-[#C8201A] transition-colors"
            >
              ← Back to Admissions
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#C8201A] hover:underline"
            >
              Contact admissions office
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
