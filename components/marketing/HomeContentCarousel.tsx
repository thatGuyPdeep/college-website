"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicNewsItem } from "@/lib/content/public-data";

function parseDateParts(dateStr: string): { day: string; month: string } {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) return { day: parts[0], month: parts[1] };
  return { day: "—", month: "" };
}

type HomeContentCarouselProps = {
  items: PublicNewsItem[];
  emptyMessage?: string;
  autoplayMs?: number;
};

/** IIT Delhi Owl-carousel pattern — news/events cards with nav arrows */
export function HomeContentCarousel({
  items,
  emptyMessage = "No items listed.",
  autoplayMs = 5000,
}: HomeContentCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const visible = count <= 1 ? count : 2;

  const next = useCallback(() => {
    if (count <= visible) return;
    setIndex((i) => (i + 1) % (count - visible + 1));
  }, [count, visible]);

  const prev = useCallback(() => {
    if (count <= visible) return;
    setIndex((i) => (i - 1 + (count - visible + 1)) % (count - visible + 1));
  }, [count, visible]);

  useEffect(() => {
    if (paused || count <= visible) return;
    const timer = setInterval(next, autoplayMs);
    return () => clearInterval(timer);
  }, [paused, next, autoplayMs, count, visible]);

  if (!count) {
    return <p className="text-sm text-gray-500 py-4">{emptyMessage}</p>;
  }

  const slice = items.slice(index, index + visible);
  const padded =
    slice.length < visible && count >= visible
      ? [...slice, ...items.slice(0, visible - slice.length)]
      : slice;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div key={index} className="grid sm:grid-cols-2 gap-3 min-h-[9rem] carousel-slide-enter">
        {padded.map((item) => {
          const { day, month } = parseDateParts(item.date);
          return (
            <article
              key={`${item.slug}-${index}`}
              className="home-carousel-card group border border-gray-100 rounded-lg overflow-hidden bg-white"
            >
              <Link href={`/news/${item.slug}`} className="block p-3 sm:p-4 h-full">
                <div className="flex gap-3">
                  <div className="shrink-0 w-11 text-center">
                    <div className="text-lg font-bold text-[#C8201A] leading-none">{day}</div>
                    <div className="text-[10px] font-semibold text-gray-500 uppercase">{month}</div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-[#0D2660] line-clamp-3 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#0D2660] mt-2 inline-block transition-transform duration-200 group-hover:translate-x-1">Read more →</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {count > visible && (
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            {Array.from({ length: count - visible + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-[#0D2660]" : "w-1.5 bg-gray-300"
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={prev}
              className="micro-carousel-btn p-1.5 rounded-md border border-gray-200 text-[#0D2660]"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="micro-carousel-btn p-1.5 rounded-md border border-gray-200 text-[#0D2660]"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
