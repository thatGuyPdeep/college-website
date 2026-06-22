import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, BookOpen } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { getFacultyById } from "@/lib/content/public-data";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { CONTACT, SITE_URL } from "@/lib/utils/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const f = await getFacultyById(id);
  return { title: f?.name ?? "Faculty Profile" };
}

export default async function FacultyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const f = await getFacultyById(id);
  if (!f) notFound();

  const base = SITE_URL.replace(/\/$/, "");
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Faculty", url: `${base}/faculty` },
    { name: f.name, url: `${base}/faculty/${id}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={f.dept} title={f.name} description={f.designation} />
      <section className="section bg-white">
        <div className="container-site max-w-2xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/faculty">Faculty</Link> / {f.name}
          </nav>

          <div className="flex items-start gap-6 mb-8">
            {f.photo_url ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
                <Image src={f.photo_url} alt={f.name} fill className="object-cover" sizes="96px" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D2660] to-[#C8201A] flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            )}
            <dl className="text-sm space-y-2">
              <div><dt className="text-gray-400">Department</dt><dd className="font-medium">{f.dept}</dd></div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <dd>{f.qual}</dd>
              </div>
              <div><dt className="text-gray-400 inline">Specialization: </dt><dd className="inline">{f.specialization}</dd></div>
              {f.exp > 0 && (
                <div><dt className="text-gray-400 inline">Experience: </dt><dd className="inline">{f.exp} years</dd></div>
              )}
            </dl>
          </div>

          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 text-sm text-[#C8201A] hover:underline">
            <Mail className="h-4 w-4" /> Contact via admissions office
          </a>
        </div>
      </section>
    </>
  );
}
