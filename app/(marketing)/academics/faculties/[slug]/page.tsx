import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { ACADEMIC_FACULTIES, getAcademicFaculty } from "@/lib/content/academic-faculties";
import { DEPARTMENTS } from "@/lib/content/departments";
import { getExplorerPrograms } from "@/lib/content/programs";

export async function generateStaticParams() {
  return ACADEMIC_FACULTIES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = getAcademicFaculty(slug);
  return { title: f?.name ?? "Faculty" };
}

export default async function FacultyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faculty = getAcademicFaculty(slug);
  if (!faculty) notFound();

  const departments = DEPARTMENTS.filter((d) => faculty.departmentSlugs.includes(d.slug));
  const allPrograms = await getExplorerPrograms();
  const programs = allPrograms.filter((p) => faculty.programSlugs.includes(p.slug));

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title={faculty.name}
        description={faculty.overview}
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/academics">Academics</Link> /{" "}
            <Link href="/academics/faculties">Faculties</Link> / {faculty.name}
          </nav>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Departments</h2>
            <ul className="space-y-3">
              {departments.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/academics/departments/${d.slug}`}
                    className="font-medium text-[#0D2660] hover:underline"
                  >
                    {d.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">{d.overview}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Programmes</h2>
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

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[#0D2660] mb-4">People</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(["faculty", "staff", "students", "authorities"] as const).map((section) => (
                <Link
                  key={section}
                  href={`/people/${section}?dept=${departments[0]?.slug ?? ""}`}
                  className="p-4 rounded-xl border border-blue-100 bg-[#F0F4FF] text-sm font-semibold text-[#0D2660] hover:border-[#0D2660]/30 capitalize"
                >
                  {section}
                </Link>
              ))}
            </div>
          </section>

          <Link href="/prospectus" className="text-sm font-semibold text-[#C8201A] hover:underline">
            View prospectus →
          </Link>
        </div>
      </section>
    </>
  );
}
