import type { PublicNewsItem } from "@/lib/content/public-data";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";
import { HomeContentCarousel } from "@/components/marketing/HomeContentCarousel";
import { PROGRAMS } from "@/lib/utils/constants";
import Link from "next/link";

type HomeNewsEventsGridProps = {
  news: PublicNewsItem[];
  events: PublicNewsItem[];
};

/** IIT Delhi — Latest News · Upcoming Events · Programmes (carousels + static list) */
export function HomeNewsEventsGrid({ news, events }: HomeNewsEventsGridProps) {
  const newsItems = news.filter((n) => n.category !== "Event").slice(0, 8);
  const eventItems = events.slice(0, 8);
  const programmes = PROGRAMS.slice(0, 6);

  return (
    <section className="home-section iitd-silver-deep border-y border-gray-200">
      <div className="container-site">
        <HomeSectionHeading
          variant="centered"
          title="News & "
          accent="Events"
          className="mb-6 sm:mb-8"
        />
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white border border-gray-200 p-4 sm:p-5 shadow-sm">
            <HomeSectionHeading title="Latest News" viewAllHref="/news" className="mb-4" />
            <HomeContentCarousel items={newsItems} emptyMessage="No news at this time." />
          </div>

          <div className="bg-white border border-gray-200 p-4 sm:p-5 shadow-sm">
            <HomeSectionHeading title="Upcoming Events" viewAllHref="/events" className="mb-4" />
            <HomeContentCarousel
              items={eventItems}
              emptyMessage="No upcoming events. Please check back soon."
            />
          </div>

          <div className="bg-white border border-gray-200 p-4 sm:p-5 shadow-sm">
            <HomeSectionHeading title="Programmes" viewAllHref="/academics" className="mb-4" />
            <ul className="divide-y divide-gray-100">
              {programmes.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/academics/courses/${p.slug}`}
                    className="block py-3 sm:py-3.5 group hover:bg-blue-50/50 -mx-2 px-2 rounded transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[#0D2660] leading-snug">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 uppercase">{p.level} · Read more →</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
