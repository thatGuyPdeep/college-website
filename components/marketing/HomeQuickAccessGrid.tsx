import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HOME_QUICK_ACCESS } from "@/lib/content/design-portal";
import { cn } from "@/lib/utils";

const ACCENT = {
  crimson: "border-l-[#C8201A] hover:bg-red-50/80",
  navy:    "border-l-[#0D2660] hover:bg-blue-50/80",
  gold:    "border-l-[#F5C200] hover:bg-yellow-50/60",
};

/** IIT Delhi–style portal quick-access tiles on home */
export function HomeQuickAccessGrid() {
  return (
    <section className="bg-white border-b border-blue-100 py-6 sm:py-8" aria-labelledby="quick-access-heading">
      <div className="container-site">
        <h2 id="quick-access-heading" className="sr-only">Quick access portals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {HOME_QUICK_ACCESS.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={cn(
                "group flex items-start justify-between gap-3 p-4 sm:p-5 rounded-lg border border-blue-100 bg-white border-l-4 shadow-sm transition-colors card-lift",
                ACCENT[tile.accent]
              )}
            >
              <div className="min-w-0">
                <h3 className="font-bold text-[#0D2660] text-sm sm:text-base group-hover:text-[#C8201A] transition-colors leading-snug">
                  {tile.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tile.subtitle}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
