import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Scholarships & Reservation" };

const SCHOLARSHIPS = [
  { name: "Post-Matric Scholarship (SC/ST/OBC)", body: "State and central government scholarships for eligible category students — apply through the National Scholarship Portal." },
  { name: "Merit-cum-Means", body: "Institutional support for economically weaker meritorious students, subject to availability." },
  { name: "Tribal Welfare Schemes", body: "Chhattisgarh tribal welfare department schemes for students from scheduled tribes in Bastar region." },
];

const RESERVATION = [
  "Reservation follows Government of Chhattisgarh and affiliating university norms for SC, ST, OBC, EWS, and PwD categories.",
  "Caste certificate must be uploaded during application and verified at admission.",
  "Horizontal reservation for women, ex-servicemen, and other categories as applicable.",
];

export default function ScholarshipsPage() {
  return (
    <>
      <PageHero eyebrow="Admissions" title="Scholarships & Reservation" description="Financial aid and reservation policy for undergraduate admissions." />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/admissions">Admissions</Link> / Scholarships
          </nav>

          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Scholarships & Fellowships</h2>
          <ul className="space-y-4 mb-10">
            {SCHOLARSHIPS.map((s) => (
              <li key={s.name} className="border border-blue-100 rounded-xl p-5">
                <h3 className="font-medium text-gray-900">{s.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.body}</p>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Reservation Policy</h2>
          <ul className="space-y-2 text-sm text-gray-600 mb-8">
            {RESERVATION.map((r) => (
              <li key={r} className="flex gap-2"><span className="text-[#C8201A]">•</span>{r}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-500">
            For assistance with scholarship applications, contact the admissions office via{" "}
            <Link href="/contact" className="text-[#C8201A] font-semibold hover:underline">Contact</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
