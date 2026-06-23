import Link from "next/link";
import type { PublicNewsItem } from "@/lib/content/public-data";

function parseDateParts(dateStr: string): { day: string; month: string } {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) return { day: parts[0], month: parts[1] };
  return { day: "—", month: "" };
}

type HomeDatedListProps = {
  items: PublicNewsItem[];
  emptyMessage?: string;
};

/** IIT Delhi — dated news/events list with day + month badge */
export function HomeDatedList({ items, emptyMessage = "No items listed." }: HomeDatedListProps) {
  if (!items.length) {
    return <p className="text-sm text-gray-500 py-4">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item) => {
        const { day, month } = parseDateParts(item.date);
        return (
          <li key={item.slug}>
            <Link
              href={`/news/${item.slug}`}
              className="flex gap-3 sm:gap-4 py-3 sm:py-3.5 group hover:bg-blue-50/50 -mx-2 px-2 rounded transition-colors"
            >
              <div className="shrink-0 w-12 sm:w-14 text-center">
                <div className="text-lg sm:text-xl font-bold text-[#C8201A] leading-none">{day}</div>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">{month}</div>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-800 group-hover:text-[#0D2660] leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Read more →</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
