import Link from "next/link";
import { FileText } from "lucide-react";
import type { PublicNewsItem } from "@/lib/content/public-data";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";
import { NewsPdfLink } from "@/components/marketing/NewsPdfLink";

/** IIT Delhi — “Important Announcements” card list with highlight + hover slide */
export function HomeImportantAnnouncements({ items }: { items: PublicNewsItem[] }) {
  const announcements = items
    .filter((n) => n.category !== "Event")
    .slice(0, 10);

  if (!announcements.length) return null;

  const [featured, ...rest] = announcements;

  return (
    <section className="home-section announcement-section border-b border-gray-200 pt-10 sm:pt-12">
      <div className="container-site">
        <HomeSectionHeading
          variant="centered"
          title="Important "
          accent="Announcements"
          viewAllHref="/news"
        />

        <div className="announcement-list space-y-3 sm:space-y-4">
          {/* Highlight first announcement — IITD Research Impact pattern */}
          <article className="announcement-card announcement-card--highlight">
            <Link
              href={`/news/${featured.slug}`}
              className="block p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="shrink-0 flex items-center justify-center w-full sm:w-28 h-16 sm:h-20 rounded-md bg-[#0D2660]/10 border-2 border-[#C8201A] announcement-blink-border">
                  <FileText className="h-8 w-8 text-[#C8201A]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0D2660] leading-snug">
                    {featured.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                    <time>{featured.date}</time>
                    <span className="text-[#C8201A] font-semibold">[{featured.category}]</span>
                    {featured.attachmentUrl && (
                      <NewsPdfLink
                        href={featured.attachmentUrl}
                        label={featured.attachmentLabel ?? "PDF"}
                        size={featured.attachmentSize ?? undefined}
                        language={featured.language}
                        className="text-xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </article>

          {rest.map((n) => (
            <article key={n.slug} className="announcement-card">
              <Link href={`/news/${n.slug}`} className="block p-4 sm:px-5 sm:py-4">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#003366] leading-snug">
                  {n.title}
                </h3>
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
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
