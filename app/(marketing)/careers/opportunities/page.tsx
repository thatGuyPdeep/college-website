import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PROGRAMS } from "@/lib/utils/constants";

export const metadata: Metadata = { title: "Career Opportunities by Programme" };

export default function CareerOpportunitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="People"
        title="Future Career Opportunities"
        description="Pathways and roles aligned with each undergraduate programme — placements, higher studies, and Mission service."
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/careers">Careers</Link> / Opportunities
          </nav>

          <p className="text-gray-600 leading-relaxed mb-10">
            Graduates from RKM Vivekananda College pursue careers in banking, IT, teaching, sports
            coaching, civil services preparation, and social sector work — many continuing the Mission&apos;s
            service in tribal Bastar. Explore programme-specific pathways below.
          </p>

          <ul className="space-y-6">
            {PROGRAMS.map((p) => (
              <li key={p.slug} className="p-5 rounded-xl border border-blue-100">
                <Link href={`/academics/courses/${p.slug}`} className="font-semibold text-[#0D2660] hover:underline">
                  {p.name}
                </Link>
                <p className="text-sm text-gray-600 mt-2">{p.short}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.highlights.map((h) => (
                    <span key={h} className="text-xs px-2 py-1 rounded-full bg-[#F0F4FF] text-[#0D2660]">
                      {h}
                    </span>
                  ))}
                </div>
                <Link href="/placements" className="inline-block mt-3 text-xs font-semibold text-[#C8201A] hover:underline">
                  Placements & higher studies →
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-6 rounded-xl bg-[#F0F4FF] border border-blue-100">
            <h2 className="font-semibold text-[#0D2660] mb-2">Open Vacancies</h2>
            <p className="text-sm text-gray-600 mb-3">Faculty and staff recruitment is handled through the official portal.</p>
            <Link href="/careers" className="text-sm font-semibold text-[#C8201A] hover:underline">
              View vacancies →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
