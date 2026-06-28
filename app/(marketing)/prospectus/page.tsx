import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PROGRAMS } from "@/lib/utils/constants";

export const metadata: Metadata = { title: "Prospectus" };

export default function ProspectusPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="College Prospectus"
        description="Programmes, eligibility, and admission information for session 2026–27."
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/academics">Academics</Link> / Prospectus
          </nav>

          <div className="prose prose-sm max-w-none text-gray-600 mb-10">
            <p>
              The college offers NEP 2020 Four-Year Undergraduate Programmes (FYUGP) affiliated to
              Shaheed Mahendra Karma Vishwavidyalaya (Bastar University), Jagdalpur, along with
              B.P.Ed. and NCVT-affiliated ITI trades under the Ramakrishna Mission Ashrama.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Programmes Offered</h2>
          <ul className="space-y-4 mb-10">
            {PROGRAMS.map((p) => (
              <li key={p.slug} className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF]/50">
                <Link href={`/academics/courses/${p.slug}`} className="font-semibold text-[#0D2660] hover:underline">
                  {p.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{p.duration} · {p.dept}</p>
                <p className="text-sm text-gray-600 mt-2">{p.short}</p>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admissions/how-to-apply"
              className="inline-flex px-5 py-2.5 bg-[#B80F0A] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#9B1812]"
            >
              How to Apply
            </Link>
            <Link
              href="/admissions/fees"
              className="inline-flex px-5 py-2.5 border border-[#0D2660] text-[#0D2660] text-sm font-semibold hover:bg-[#F0F4FF]"
            >
              Fee Structure
            </Link>
            <Link
              href="/academics/syllabus"
              className="inline-flex px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
            >
              Syllabus
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
