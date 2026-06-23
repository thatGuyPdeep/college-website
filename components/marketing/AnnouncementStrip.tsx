import Link from "next/link";
import { HOME_ANNOUNCEMENTS } from "@/lib/content/reference-portal";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:   "bg-[#C8201A] hover:bg-[#9B1812] text-white",
  secondary: "bg-[#F5C200] hover:bg-[#D4A800] text-[#0D2660]",
  navy:      "bg-[#0D2660]/90 hover:bg-[#071540] text-white border border-white/20",
};

export function AnnouncementStrip() {
  return (
    <section className="border-b border-blue-100 bg-white" aria-label="Important announcements">
      <div className="container-site py-3">
        <div className="flex gap-3 overflow-x-auto scroll-strip pb-1">
          {HOME_ANNOUNCEMENTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 min-w-[260px] sm:min-w-[300px] rounded-xl px-5 py-4 transition-transform hover:scale-[1.02]",
                VARIANTS[item.variant]
              )}
            >
              <p className="font-bold text-sm sm:text-base leading-snug">{item.title}</p>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">{item.subtitle}</p>
              <span className="inline-block mt-2 text-xs font-bold underline underline-offset-2">
                {item.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
