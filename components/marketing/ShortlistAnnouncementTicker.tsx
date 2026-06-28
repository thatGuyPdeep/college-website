import Link from "next/link";
import { Megaphone } from "lucide-react";
import { NOTICE_TICKER_ITEMS } from "@/lib/content/site-notices";
import { SHORTLIST_META } from "@/lib/content/admissions-shortlist-first";

export function ShortlistAnnouncementTicker() {
  if (!NOTICE_TICKER_ITEMS.length) return null;

  const doubled = [...NOTICE_TICKER_ITEMS, ...NOTICE_TICKER_ITEMS];

  return (
    <section
      className="bg-[#0D2660] border-b-2 border-[#C8201A]/50 overflow-hidden"
      aria-label="College notices and announcements"
      aria-live="polite"
    >
      <div className="flex items-stretch min-h-[40px]">
        <div className="shrink-0 bg-[#C8201A] px-3 sm:px-4 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-white hidden sm:block" aria-hidden="true" />
          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">
            Notice
          </span>
        </div>

        <div className="flex-1 overflow-hidden py-2 min-w-0">
          <div className="notice-ticker-track flex w-max whitespace-nowrap">
            {doubled.map((item, i) => (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-3 px-6 sm:px-10 text-sm text-white hover:text-[#F5C200] transition-colors"
              >
                <span className="text-[#F5C200] font-bold" aria-hidden="true">
                  ●
                </span>
                <span>{item.message}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href={SHORTLIST_META.href}
          className="shrink-0 flex items-center px-3 sm:px-4 text-[10px] sm:text-xs font-semibold text-[#F5C200] hover:text-white hover:underline bg-[#071540]/40 transition-colors whitespace-nowrap"
        >
          Shortlist
        </Link>
      </div>
    </section>
  );
}
