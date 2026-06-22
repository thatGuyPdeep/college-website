import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/PageHero";
import { getNewsBySlug, getPublicNews } from "@/lib/content/public-data";

export async function generateStaticParams() {
  const news = await getPublicNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  return { title: item?.title ?? "News" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero eyebrow={item.category} title={item.title} description={item.date} />
      <article className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/news">News</Link> / {item.title}
          </nav>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
            <Image src={item.img} alt={item.title} fill className="object-cover" sizes="768px" />
          </div>
          <Badge variant="outline" className="mb-4">{item.category}</Badge>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {item.body ?? item.excerpt}
          </div>
          <Link href="/news" className="inline-block mt-10 text-[#C8201A] font-semibold hover:underline">
            ← Back to News
          </Link>
        </div>
      </article>
    </>
  );
}
