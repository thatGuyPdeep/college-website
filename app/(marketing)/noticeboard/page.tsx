import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { getPublicNews } from "@/lib/content/public-data";

export const metadata: Metadata = { title: "Noticeboard" };

export default async function NoticeboardPage() {
  const news = await getPublicNews(40);
  const notices = news.filter((n) => n.category === "Notice" || n.category === "Announcement");

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

          {notices.length === 0 ? (
            <p className="text-gray-600">
              No notices published yet. See{" "}
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
