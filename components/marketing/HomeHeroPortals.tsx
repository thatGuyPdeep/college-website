"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOME_HERO_PORTALS } from "@/lib/content/design-portal";
import { SITE_FULL_NAME } from "@/lib/utils/constants";

/** IIT Delhi — large hero portal tiles with optional slide on mobile */
export function HomeHeroPortals() {
  const [active, setActive] = useState(0);
  const count = HOME_HERO_PORTALS.length;

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section className="bg-white border-b border-gray-200" aria-label="Portal quick access">
      <div className="container-site py-4 sm:py-5">
        <p className="text-center text-[11px] sm:text-xs text-gray-500 uppercase tracking-widest mb-3 sm:mb-4">
          {SITE_FULL_NAME}
        </p>

        {/* Mobile: single slide */}
        <div className="relative lg:hidden">
          <Link
            href={HOME_HERO_PORTALS[active].href}
            className="group relative block aspect-[16/9] sm:aspect-[2/1] rounded-lg overflow-hidden"
          >
            <Image
              src={HOME_HERO_PORTALS[active].image}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071540]/95 via-[#0D2660]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{HOME_HERO_PORTALS[active].title}</h2>
              <p className="text-sm text-blue-200 mt-1">{HOME_HERO_PORTALS[active].subtitle}</p>
            </div>
          </Link>
          <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
            <button
              type="button"
              className="pointer-events-auto p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
              onClick={() => setActive((i) => (i - 1 + count) % count)}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="pointer-events-auto p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
              onClick={() => setActive((i) => (i + 1) % count)}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {HOME_HERO_PORTALS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-[#0D2660]" : "w-1.5 bg-gray-300"}`}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden lg:grid grid-cols-4 gap-3">
          {HOME_HERO_PORTALS.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden border border-gray-200"
            >
              <Image
                src={portal.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="25vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071540]/95 via-[#0D2660]/40 to-[#0D2660]/10 group-hover:via-[#0D2660]/55 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-lg font-bold text-white leading-tight">{portal.title}</h2>
                <p className="text-xs text-blue-200 mt-1 leading-snug">{portal.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
