import Link from "next/link";
import type { PublicNewsItem } from "@/lib/content/public-data";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";

type ColumnProps = {
  title: string;
  viewAllHref: string;
  items: { title: string; href: string; date?: string }[];
  empty: string;
};

function FeedColumn({ title, viewAllHref, items, empty }: ColumnProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="bg-[#0D2660] text-white px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide">{title}</h3>
        <Link href={viewAllHref} className="text-[10px] sm:text-xs text-[#F5C200] hover:underline font-semibold">
          View All →
        </Link>
      </div>
      <ul className="divide-y divide-gray-100 flex-1">
        {items.length === 0 ? (
          <li className="px-4 py-6 text-sm text-gray-500">{empty}</li>
        ) : (
          items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-3 hover:bg-[#F0F4FF]/60 transition-colors group"
              >
                <p className="text-sm text-gray-800 group-hover:text-[#0D2660] leading-snug line-clamp-2">
                  {item.title}
                </p>
                {item.date && (
                  <time className="text-[11px] text-gray-400 mt-1 block">{item.date}</time>
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/** IIT Kanpur — News Update · Announcements · Admission three-column feed */
export function HomeIITKFeed({ news }: { news: PublicNewsItem[] }) {
  const newsUpdates = news.slice(0, 8).map((n) => ({
    title: n.title,
    href: `/news/${n.slug}`,
    date: n.date,
  }));

  const announcements = news
    .filter((n) => n.category === "Notice" || n.category === "Announcement")
    .slice(0, 8)
    .map((n) => ({
      title: n.title,
      href: `/news/${n.slug}`,
      date: n.date,
    }));

  const admissions = [
    { title: "Apply Online — UG & ITI Session 2026–27", href: "/admissions/apply" },
    { title: "How to Apply — Documents & Process", href: "/admissions/how-to-apply" },
    { title: "Fee Structure & Scholarships", href: "/admissions/fees" },
    { title: "Seats Availability", href: "/admissions/seats" },
    { title: "College Prospectus (FYUGP)", href: "/prospectus" },
    { title: "Track Your Application", href: "/admissions/dashboard" },
    { title: "NEP 2020 Four-Year Undergraduate Programme", href: "/nep-2020" },
    { title: "ITI & Vocational Trades", href: "/academics/iti" },
  ];

  return (
    <section className="home-section bg-[#f4f6f9] border-b border-gray-200" aria-label="College feed">
      <div className="container-site">
        <HomeSectionHeading
          variant="centered"
          title="Latest "
          accent="Updates"
          viewAllHref="/news"
          className="mb-6 sm:mb-8"
        />
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          <FeedColumn
            title="News Update"
            viewAllHref="/news"
            items={newsUpdates}
            empty="No news published yet."
          />
          <FeedColumn
            title="Announcements"
            viewAllHref="/noticeboard"
            items={announcements}
            empty="No announcements at this time."
          />
          <FeedColumn
            title="Admission"
            viewAllHref="/admissions"
            items={admissions}
            empty=""
          />
        </div>
      </div>
    </section>
  );
}
