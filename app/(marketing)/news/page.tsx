import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
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

export default async function NewsPage() {
  const news = await getPublicNews();

  return (
    <>
      <PageHero
        eyebrow="Updates"
        title="News & Events"
        description="Notices, festival observances and happenings at the Ashrama and college."
      />

      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">News &amp; Events</li>
            </ol>
            <Link href="/news/feed" className="inline-flex items-center gap-1.5 text-[#0D2660] font-medium hover:underline text-sm">
              <Rss className="h-4 w-4" aria-hidden="true" /> RSS Feed
            </Link>
          </nav>

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
                    <p className="text-sm text-gray-600 leading-relaxed">{n.excerpt}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
