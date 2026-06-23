import Link from "next/link";
import { FileText } from "lucide-react";
import type { PublicNewsItem } from "@/lib/content/public-data";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";
import { NewsPdfLink } from "@/components/marketing/NewsPdfLink";

/** IIT Delhi — “Important Announcements” full-width list */
export function HomeImportantAnnouncements({ items }: { items: PublicNewsItem[] }) {
  const announcements = items
    .filter((n) => n.category !== "Event")
    .slice(0, 10);

  if (!announcements.length) return null;

  return (
    <section className="home-section bg-[#f5f5f5] border-b border-gray-200">
      <div className="container-site">
        <HomeSectionHeading title="Important Announcements" viewAllHref="/news" />
        <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {announcements.map((n) => (
            <li key={n.slug} className="hover:bg-blue-50/40 transition-colors">
              <div className="px-4 sm:px-5 py-3.5 sm:py-4">
                <Link
                  href={`/news/${n.slug}`}
                  className="text-sm sm:text-[15px] font-medium text-gray-800 hover:text-[#0D2660] leading-snug block"
                >
                  {n.title}
                </Link>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                  <time>{n.date}</time>
                  <span className="text-[#0D2660] font-semibold">[{n.category}]</span>
                  {n.attachmentUrl && (
                    <NewsPdfLink
                      href={n.attachmentUrl}
                      label={n.attachmentLabel ?? "PDF"}
                      size={n.attachmentSize ?? undefined}
                      language={n.language}
                      className="text-xs"
                    />
                  )}
                  {!n.attachmentUrl && n.category === "Notice" && (
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3 w-3" aria-hidden="true" />
                      Notice
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
