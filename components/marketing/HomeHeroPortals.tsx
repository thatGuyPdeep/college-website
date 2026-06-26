"use client";

import Link from "next/link";
import { GraduationCap, FileCheck, BookOpen, Heart } from "lucide-react";
import { HOME_HERO_PORTALS } from "@/lib/content/design-portal";
import { useInView } from "@/hooks/useInView";

const PORTAL_ICONS = [GraduationCap, FileCheck, BookOpen, Heart] as const;

/** IIT Delhi — portal tiles overlapping hero slider (negative margin dock) */
export function HomeHeroPortals() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section
      ref={ref}
      className="relative z-30 -mt-[5.5rem] sm:-mt-[6.5rem] mb-0"
      aria-label="Portal quick access"
    >
      <div className="container-site">
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-0 shadow-xl ${
            inView ? "portal-tiles-visible" : ""
          }`}
        >
          {HOME_HERO_PORTALS.map((portal, i) => {
            const Icon = PORTAL_ICONS[i] ?? GraduationCap;
            const isDark = i % 2 === 0;

            return (
              <Link
                key={portal.href}
                href={portal.href}
                className={`portal-tile portal-tile-delay-${i + 1} group flex flex-col items-center justify-center text-center px-3 py-5 sm:py-6 min-h-[7rem] sm:min-h-[8.5rem] transition-colors micro-lift micro-press ${
                  isDark
                    ? "bg-[#2b2d3b] text-white hover:bg-[#0D2660]"
                    : "bg-[#f0f2f5] text-[#0D2660] hover:bg-white"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3 micro-icon-pop ${
                    isDark
                      ? "bg-[#B80F0A] text-white"
                      : "bg-[#0D2660] text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-tight">
                  {portal.title}
                </h2>
                <p
                  className={`text-[10px] sm:text-xs mt-1 leading-snug max-w-[10rem] ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {portal.subtitle}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
