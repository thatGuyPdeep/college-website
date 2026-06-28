import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { DeptQuickLinks } from "@/components/academics/SyllabusSemesterTables";
import { DeptPeopleLinks } from "@/components/academics/DeptPeopleLinks";
import { facultyForDepartment } from "@/lib/content/academic-faculties";
import { getDepartmentBySlug } from "@/lib/content/departments";
import { getExplorerPrograms } from "@/lib/content/programs";
import { getSyllabusForDepartment } from "@/lib/content/syllabus";
import { getPublicNews } from "@/lib/content/public-data";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/utils/constants";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const { DEPARTMENTS } = await import("@/lib/content/departments");
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartmentBySlug(slug);
  return { title: dept?.name ?? "Department" };
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = getDepartmentBySlug(slug);
  if (!dept) notFound();

  const [allPrograms, news] = await Promise.all([
    getExplorerPrograms(),
    getPublicNews(8),
  ]);
  const programs = allPrograms.filter((p) => dept.programSlugs.includes(p.slug));
  const syllabus = getSyllabusForDepartment(slug);
  const notices = news.filter((n) => n.category === "Notice").slice(0, 4);
  const academicFaculty = facultyForDepartment(slug);

  const base = SITE_URL.replace(/\/$/, "");
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Departments", url: `${base}/academics/departments` },
    { name: dept.name, url: `${base}/academics/departments/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="Department" title={dept.name} description={dept.overview} />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/academics">Academics</Link> /{" "}
            <Link href="/academics/departments">Departments</Link> / {dept.name}
          </nav>

          <DeptQuickLinks deptSlug={slug} deptName={dept.name} />

          {academicFaculty && (
            <p className="text-sm text-gray-600 mb-6">
              Part of{" "}
              <Link
                href={`/academics/faculties/${academicFaculty.slug}`}
                className="font-semibold text-[#0D2660] hover:underline"
              >
                {academicFaculty.name}
              </Link>
            </p>
          )}

          <DeptPeopleLinks deptSlug={slug} deptName={dept.name} />

          {programs.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Programmes Offered</h2>
              <ul className="space-y-3">
                {programs.map((p) => (
                  <li key={p.id}>
                    <Link href={`/academics/courses/${p.slug}`} className="text-[#0D2660] font-medium hover:underline">
                      {p.name}
                    </Link>
                    {p.duration && <span className="text-sm text-gray-500 ml-2">({p.duration})</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {syllabus && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Syllabus</h2>
              <p className="text-sm text-gray-600 mb-3">
                FYUGP session {syllabus.session} — {syllabus.semesters.length} semesters under NEP 2020.
              </p>
              <Link
                href={`/academics/syllabus/${syllabus.slug}`}
                className="inline-flex text-sm font-semibold text-[#C8201A] hover:underline"
              >
                View full {dept.name} syllabus →
              </Link>
            </section>
          )}

          {notices.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Department Notices</h2>
              <ul className="space-y-3">
                {notices.map((n) => (
                  <li key={n.slug} className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF]/50">
                    <Badge variant="outline" className="mb-2 text-xs border-[#0D2660] text-[#0D2660]">
                      {n.category}
                    </Badge>
                    <Link href={`/news/${n.slug}`} className="font-medium text-[#0D2660] hover:underline block">
                      {n.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                  </li>
                ))}
              </ul>
              <Link href="/news?category=Notice" className="inline-block mt-3 text-sm text-[#C8201A] font-semibold hover:underline">
                All notices →
              </Link>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Faculty</h2>
            <Link href="/faculty" className="text-sm text-[#C8201A] font-semibold hover:underline">
              View faculty directory →
            </Link>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Time Tables</h2>
            <p className="text-sm text-gray-600 mb-2">Semester timetables are published on the examination portal.</p>
            <Link href="/examination/timetables" className="text-sm text-[#C8201A] font-semibold hover:underline">
              Examination time tables →
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}
