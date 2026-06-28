import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ACADEMIC_FACULTIES } from "@/lib/content/academic-faculties";

export const metadata: Metadata = { title: "Academic Faculties" };

export default function FacultiesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Academic Faculties"
        description="Science, Social Sciences, and Sports — IIT-style faculty groupings for departments and programmes."
      />
      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/academics">Academics</Link> / Faculties
          </nav>
          <div className="grid sm:grid-cols-3 gap-6">
            {ACADEMIC_FACULTIES.map((f) => (
              <Link
                key={f.slug}
                href={`/academics/faculties/${f.slug}`}
                className="group p-6 rounded-xl border border-blue-100 bg-white shadow-sm hover:shadow-md hover:border-[#0D2660]/30 transition-all"
              >
                <p className="text-xs text-[#C8201A] font-semibold uppercase tracking-wide mb-1">
                  {f.hindiName}
                </p>
                <h2 className="font-bold text-[#0D2660] group-hover:text-[#C8201A] transition-colors">
                  {f.name}
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{f.overview}</p>
                <span className="inline-block mt-4 text-xs font-semibold text-[#C8201A]">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
