import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVacancyById } from "@/lib/actions/recruitment";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/utils/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getVacancyById(id);
  return { title: result.ok ? result.data.title : "Vacancy" };
}

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getVacancyById(id);
  if (!result.ok) notFound();
  const v = result.data;
  const dept = (v.departments as { name?: string } | undefined)?.name;

  const base = SITE_URL.replace(/\/$/, "");
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Careers", url: `${base}/careers` },
    { name: v.title, url: `${base}/careers/${id}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link> / <Link href="/careers">Careers</Link> / {v.title}
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{v.title}</h1>
          {v.designation && <Badge variant="secondary">{v.designation}</Badge>}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          {dept && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{dept}</span>}
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />On-campus, Narayanpur</span>
          {v.closes_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Closes: {new Date(v.closes_at).toLocaleDateString("en-IN")}
            </span>
          )}
        </div>

        {v.description && (
          <div className="prose prose-sm max-w-none text-gray-600 mb-8 whitespace-pre-wrap">{v.description}</div>
        )}

        <Button asChild className="bg-[#0D2660] text-white hover:bg-[#071540]">
          <Link href={`/careers/apply/${v.id}`}>Apply for this Position</Link>
        </Button>
      </div>
    </>
  );
}
