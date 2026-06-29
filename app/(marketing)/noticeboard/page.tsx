import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { NewsPdfLink } from "@/components/marketing/NewsPdfLink";
import { getPublicNews, getShortlistNoticeItem } from "@/lib/content/public-data";
import { SHORTLIST_META } from "@/lib/content/admissions-shortlist-first";

export const metadata: Metadata = { title: "Noticeboard" };

export default async function NoticeboardPage() {
  const news = await getPublicNews(40);
  const pinned = getShortlistNoticeItem();
  const notices = news.filter(
    (n) => (n.category === "Notice" || n.category === "Announcement") && n.slug !== pinned.slug,
  );

  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Noticeboard"
        description="Latest notices, circulars, and announcements from the college and examination cell."
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / Noticeboard
          </nav>

          <article className="mb-8 p-5 sm:p-6 rounded-xl border-2 border-[#C8201A]/40 bg-[#fff8f8] shadow-sm">
            <Badge className="mb-3 bg-[#C8201A] text-white border-0">Latest</Badge>
            <h2 className="text-lg font-bold text-[#0D2660] leading-snug">{pinned.title}</h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{pinned.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-gray-500">
              <time>{pinned.date}</time>
              <span className="text-[#C8201A] font-semibold">[{pinned.category}]</span>
              {pinned.attachmentUrl && (
                <NewsPdfLink
                  href={pinned.attachmentUrl}
                  label={pinned.attachmentLabel ?? "Download PDF"}
                  size={pinned.attachmentSize ?? undefined}
                  language={pinned.language}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href={SHORTLIST_META.href}
                className="inline-flex items-center text-sm font-semibold text-white bg-[#0D2660] hover:bg-[#071540] px-4 py-2 rounded-md transition-colors"
              >
                View list online
              </Link>
              <Link
                href={`/news/${pinned.slug}`}
                className="inline-flex items-center text-sm font-semibold text-[#0D2660] hover:text-[#C8201A] transition-colors"
              >
                Read notice →
              </Link>
            </div>
          </article>

          {notices.length === 0 ? (
            <p className="text-gray-600">
              No other notices published yet. See{" "}
              <Link href="/news" className="text-[#C8201A] font-semibold hover:underline">
                all news
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-4">
              {notices.map((n) => (
                <li key={n.slug} className="p-5 rounded-xl border border-blue-100 bg-[#F0F4FF]/40">
                  <Badge variant="outline" className="mb-2 text-xs border-[#0D2660] text-[#0D2660]">
                    {n.category}
                  </Badge>
                  <Link href={`/news/${n.slug}`} className="font-semibold text-[#0D2660] hover:underline block">
                    {n.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-2">{n.date}</p>
                  {n.attachmentUrl && (
                    <div className="mt-2">
                      <NewsPdfLink
                        href={n.attachmentUrl}
                        label={n.attachmentLabel ?? "Download PDF"}
                        size={n.attachmentSize ?? undefined}
                        language={n.language}
                        className="text-xs"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/examination/notices" className="text-[#C8201A] font-semibold hover:underline">
              Examination notices →
            </Link>
            <Link href="/news?category=Notice" className="text-[#C8201A] font-semibold hover:underline">
              All notices in news →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
