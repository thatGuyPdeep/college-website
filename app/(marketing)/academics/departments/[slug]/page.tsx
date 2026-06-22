import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { getDepartmentBySlug } from "@/lib/content/departments";
import { getExplorerPrograms } from "@/lib/content/programs";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/utils/constants";

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

  const allPrograms = await getExplorerPrograms();
  const programs = allPrograms.filter((p) => dept.programSlugs.includes(p.slug));

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

          {programs.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-[#0D2660] mb-4">Programmes Offered</h2>
              <ul className="space-y-3 mb-8">
                {programs.map((p) => (
                  <li key={p.id}>
                    <Link href={`/academics/courses/${p.slug}`} className="text-[#0D2660] font-medium hover:underline">
                      {p.name}
                    </Link>
                    {p.duration && <span className="text-sm text-gray-500 ml-2">({p.duration})</span>}
                  </li>
                ))}
              </ul>
            </>
          )}

          <Link href="/faculty" className="text-sm text-[#C8201A] font-semibold hover:underline">
            View faculty directory →
          </Link>
        </div>
      </section>
    </>
  );
}
