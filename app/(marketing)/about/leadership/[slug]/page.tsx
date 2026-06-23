import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { getLeadershipBySlug, LEADERSHIP_PROFILES } from "@/lib/content/leadership-profiles";

export async function generateStaticParams() {
  return LEADERSHIP_PROFILES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = getLeadershipBySlug(slug);
  return { title: person ? `${person.name} — ${person.title}` : "Leadership" };
}

export default async function LeadershipProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getLeadershipBySlug(slug);
  if (!person) notFound();

  return (
    <MarketingPage
      title={person.name}
      hindiTitle={person.titleHi}
      description={`${person.title} · ${person.org}`}
      breadcrumbs={[
        { label: "About", href: "/about" },
        { label: "Leadership", href: "/about#leadership" },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-8">
        <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
          <Image src={person.image} alt={person.name} fill className="object-cover" sizes="320px" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <p className="text-sm text-[#C8201A] font-semibold">{person.title}</p>
            <p className="text-sm text-gray-500">{person.org}</p>
          </div>
          <p className="text-gray-600 leading-relaxed">{person.body}</p>
          <blockquote className="border-l-4 border-[#F5C200] pl-5 italic text-gray-700 leading-relaxed">
            {person.message}
          </blockquote>
          <Link href="/about#leadership" className="text-sm text-[#0D2660] font-semibold hover:underline">
            ← All leadership profiles
          </Link>
        </div>
      </div>
    </MarketingPage>
  );
}
