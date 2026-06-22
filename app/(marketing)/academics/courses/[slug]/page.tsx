import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { getExplorerPrograms, getProgramBySlug } from "@/lib/content/programs";
import { courseJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/utils/constants";

export async function generateStaticParams() {
  const programs = await getExplorerPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProgramBySlug(slug);
  return {
    title: p?.name ?? "Programme",
    description: p?.short ?? p?.eligibility ?? undefined,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const base = SITE_URL.replace(/\/$/, "");
  const courseLd = courseJsonLd({ name: program.name, description: program.short ?? program.eligibility ?? "", url: `${base}/academics/courses/${slug}` });
  const crumbLd = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Academics", url: `${base}/academics` },
    { name: program.name, url: `${base}/academics/courses/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <PageHero eyebrow={program.levelLabel} title={program.name} description={program.duration ?? undefined} />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/academics">Academics</Link> / {program.name}
          </nav>

          <dl className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
            {program.department && (
              <div><dt className="text-gray-400">Department</dt><dd className="font-medium">{program.department}</dd></div>
            )}
            <div><dt className="text-gray-400">Mode</dt><dd className="font-medium">{program.modeLabel}</dd></div>
            {program.fees != null && (
              <div><dt className="text-gray-400">Annual Fee (indicative)</dt><dd className="font-medium">₹{program.fees.toLocaleString("en-IN")}</dd></div>
            )}
          </dl>

          {program.eligibility && (
            <div className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0D2660] mb-3">
                <BookOpen className="h-5 w-5" aria-hidden="true" /> Eligibility
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{program.eligibility}</p>
            </div>
          )}

          {program.curriculum && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Curriculum</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{program.curriculum}</p>
            </div>
          )}

          {program.outcomes && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Learning Outcomes</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{program.outcomes}</p>
            </div>
          )}

          {program.highlights.length > 0 && (
            <ul className="mb-8 space-y-2">
              {program.highlights.map((h) => (
                <li key={h} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-[#C8201A]">•</span> {h}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-100">
            <Button asChild className="bg-[#C8201A] hover:bg-[#9B1812] text-white">
              <Link href="/admissions/apply">Apply for this Programme <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
              <Link href="/contact">Enquire</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
