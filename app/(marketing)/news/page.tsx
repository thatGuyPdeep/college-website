import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { NewsPdfLink } from "@/components/marketing/NewsPdfLink";
import { getPublicNews } from "@/lib/content/public-data";
import { SITE_URL } from "@/lib/utils/constants";

const base = SITE_URL.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "News & Events",
  alternates: {
    types: {
      "application/rss+xml": `${base}/news/feed`,
    },
  },
};

const CATEGORY_FILTERS = ["All", "Notice", "Admissions", "Event"] as const;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const activeCategory = rawCategory?.trim() || "All";
  const allNews = await getPublicNews();
  const news =
    activeCategory === "All"
      ? allNews
      : allNews.filter(
          (n) => n.category.toLowerCase() === activeCategory.toLowerCase(),
        );

  const heroTitle =
    activeCategory !== "All" ? `${activeCategory} — News & Notices` : "News & Events";

  return (
    <>
      <PageHero
        eyebrow="Updates"
        title={heroTitle}
        description="Notices, festival observances and happenings at the Ashrama and college."
      />

      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">News &amp; Events</li>
            </ol>
            <Link href="/news/feed" className="inline-flex items-center gap-1.5 text-[#0D2660] font-medium hover:underline text-sm">
              <Rss className="h-4 w-4" aria-hidden="true" /> RSS Feed
            </Link>
          </nav>

          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter by category">
            {CATEGORY_FILTERS.map((cat) => {
              const href = cat === "All" ? "/news" : `/news?category=${encodeURIComponent(cat)}`;
              const active = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? "bg-[#0D2660] text-white border-[#0D2660]"
                      : "bg-white text-[#0D2660] border-blue-200 hover:bg-blue-50"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {news.length === 0 ? (
            <p className="text-gray-500 text-sm">No items in this category.</p>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {news.map((n) => (
                <Card key={n.slug} className="overflow-hidden card-lift border-blue-100 py-0 gap-0">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="relative w-full md:w-56 lg:w-64 h-48 md:h-auto md:min-h-[11rem] shrink-0">
                      <Image
                        src={n.img}
                        alt={n.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                    </div>
                    <div className="p-5 sm:p-6 flex-1 min-w-0">
                      <Badge variant="outline" className="mb-2 text-xs border-[#0D2660] text-[#0D2660] bg-blue-50">
                        {n.category}
                      </Badge>
                      <h2 className="font-semibold text-gray-900 text-lg mb-1 leading-snug">
                        <Link href={`/news/${n.slug}`} className="hover:text-[#0D2660] transition-colors">
                          {n.title}
                        </Link>
                      </h2>
                      <p className="text-xs text-gray-400 mb-2">{n.date}</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{n.excerpt}</p>
                      {n.attachmentUrl && (
                        <NewsPdfLink
                          href={n.attachmentUrl}
                          label={n.attachmentLabel ?? "Download"}
                          size={n.attachmentSize ?? undefined}
                          language={n.language}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
