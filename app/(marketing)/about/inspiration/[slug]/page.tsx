import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import {
  INSPIRATION_BIOGRAPHIES,
  getInspirationBySlug,
  getAllInspirationSlugs,
} from "@/lib/content/inspiration";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/utils/constants";

export async function generateStaticParams() {
  return getAllInspirationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = getInspirationBySlug(slug);
  const intro = profile?.sections[0]?.paragraphs[0];
  return {
    title: profile?.name ?? "Our Inspiration",
    description: intro?.slice(0, 160),
  };
}

export default async function InspirationProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getInspirationBySlug(slug);
  if (!profile) notFound();

  const base = SITE_URL.replace(/\/$/, "");
  const url = `${base}/about/inspiration/${slug}`;
  const crumbLd = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "About", url: `${base}/about` },
    { name: profile.name, url },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <PageHero eyebrow="Our Inspiration" title={profile.name} description={profile.title} />

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <Link href="/about" className="inline-flex items-center gap-1 text-sm text-[#0D2660] hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>

          <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-blue-100 shadow-md mb-10">
            <Image src={profile.img} alt={profile.name} fill className="object-cover" sizes="384px" priority />
          </div>

          <div className="space-y-8">
            {profile.sections.map((s, i) => (
              <article key={s.heading ?? i}>
                {s.heading && <h2 className="text-xl font-bold text-[#0D2660] mb-3">{s.heading}</h2>}
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="text-gray-600 leading-relaxed mb-4 last:mb-0">{p}</p>
                ))}
              </article>
            ))}
          </div>

          {profile.messages.length > 0 && (
            <div className="mt-12 bg-[#F0F4FF] rounded-xl p-6 border border-blue-100">
              <h2 className="font-bold text-[#0D2660] mb-4">Message</h2>
              <ul className="space-y-3">
                {profile.messages.map((m) => (
                  <li key={m.slice(0, 30)} className="text-gray-700 text-sm leading-relaxed italic border-l-2 border-[#C8201A] pl-4">
                    &ldquo;{m}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          )}

          <nav className="mt-10 flex flex-wrap gap-4 text-sm" aria-label="Other inspiration profiles">
            {INSPIRATION_BIOGRAPHIES.filter((p) => p.slug !== slug).map((p) => (
              <Link key={p.slug} href={`/about/inspiration/${p.slug}`} className="text-[#0D2660] font-semibold hover:underline">
                {p.name} →
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
