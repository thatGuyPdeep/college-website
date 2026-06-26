"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/content/design-portal";

/** IIT Delhi Revolution Slider — fullscreen hero with fade transitions */
export function HomeHeroSlider() {
  const [active, setActive] = useState(0);
  const count = HERO_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % count), 8000);
    return () => clearInterval(timer);
  }, [count]);

  const slide = HERO_SLIDES[active];

  return (
    <section className="relative w-full overflow-hidden iitd-hero-slider" aria-label="Featured highlights">
      <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[480px] xl:min-h-[520px]">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.href}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === active ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== active}
          >
            <Image
              src={s.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#071540]/40 via-[#0D2660]/35 to-[#071540]/75" />
          </div>
        ))}

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 min-h-[280px] sm:min-h-[380px] lg:min-h-[480px] xl:min-h-[520px] pt-8 pb-24 sm:pb-28">
          <div key={active} className="hero-caption-enter">
            <h1 className="iitd-hero-title font-heading text-white uppercase max-w-4xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-100 max-w-2xl font-light">
                {slide.subtitle}
              </p>
            )}
            <Link
              href={slide.href}
              className="mt-6 sm:mt-8 inline-flex items-center px-8 py-2.5 bg-[#B80F0A] hover:bg-[#9B1812] text-white text-sm font-semibold uppercase tracking-wide shadow-lg micro-lift micro-press"
            >
              {slide.cta}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[5.5rem] sm:bottom-[6.5rem] left-0 right-0 z-20 flex justify-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`h-1 rounded-full transition-all ${
                i === active ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
              }`}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 hidden sm:flex"
          onClick={() => setActive((i) => (i - 1 + count) % count)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 hidden sm:flex"
          onClick={() => setActive((i) => (i + 1) % count)}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20"
          aria-hidden="true"
        >
          <div
            className="h-full bg-white/70 transition-all duration-300"
            style={{ width: `${((active + 1) / count) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
