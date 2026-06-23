import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { SyllabusSemesterTables } from "@/components/academics/SyllabusSemesterTables";
import {
  SYLLABUS_SUBJECTS,
  SYLLABUS_TYPE_LEGEND,
  getSyllabusBySlug,
} from "@/lib/content/syllabus";

export async function generateStaticParams() {
  return SYLLABUS_SUBJECTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subject = getSyllabusBySlug(slug);
  return { title: subject ? `${subject.name} Syllabus` : "Syllabus" };
}

export default async function SyllabusSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = getSyllabusBySlug(slug);
  if (!subject) notFound();

  return (
    <MarketingPage
      title={`${subject.name} — Syllabus`}
      hindiTitle="पाठ्यक्रम"
      description={`${subject.programme} · Session ${subject.session} · ${subject.university}`}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Syllabus", href: "/academics/syllabus" },
      ]}
    >
      {subject.departmentSlug && (
        <p className="text-sm mb-6">
          <Link
            href={`/academics/departments/${subject.departmentSlug}`}
            className="text-[#C8201A] font-semibold hover:underline"
          >
            {subject.name} Department →
          </Link>
        </p>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold text-[#0D2660] mb-3">Programme Outcomes</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          {subject.outcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <SyllabusSemesterTables semesters={subject.semesters} />

      {subject.electiveNote && (
        <p className="mt-6 text-sm text-gray-500 border-l-4 border-[#F5C200] pl-4">{subject.electiveNote}</p>
      )}

      {subject.downloadNote && (
        <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-4">
          {subject.downloadNote}
        </p>
      )}

      <details className="mt-8 text-sm text-gray-500">
        <summary className="cursor-pointer font-semibold text-[#0D2660]">Course type legend</summary>
        <ul className="mt-2 space-y-1 pl-4">
          {Object.entries(SYLLABUS_TYPE_LEGEND).map(([code, label]) => (
            <li key={code}><strong>{code}</strong> — {label}</li>
          ))}
        </ul>
      </details>
    </MarketingPage>
  );
}
