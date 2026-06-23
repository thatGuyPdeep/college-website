import Link from "next/link";
import type { PublicNewsItem } from "@/lib/content/public-data";

type NewsTickerProps = {
  items: PublicNewsItem[];
};

export function NewsTicker({ items }: NewsTickerProps) {
  const tickerItems = items.filter((n) => n.category === "Notice" || n.category === "Admissions").slice(0, 8);
  if (!tickerItems.length) return null;

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-[#000080] border-y border-white/20 overflow-hidden" aria-live="polite">
      <div className="flex items-stretch">
        <div className="shrink-0 bg-[#C8201A] px-3 sm:px-4 flex items-center">
          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">
            Latest
          </span>
        </div>
        <div className="flex-1 overflow-hidden py-2">
          <div className="news-ticker-track flex whitespace-nowrap">
            {doubled.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/news/${item.slug}`}
                className="inline-flex items-center gap-2 px-8 text-sm text-white hover:text-[#F5C200] transition-colors"
              >
                <span className="text-[#FFD700] font-bold animate-pulse" aria-hidden="true">●</span>
                <span className="text-[10px] uppercase text-blue-200 font-semibold">{item.category}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/news"
          className="shrink-0 hidden sm:flex items-center px-4 text-xs font-semibold text-[#F5C200] hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  );
}
