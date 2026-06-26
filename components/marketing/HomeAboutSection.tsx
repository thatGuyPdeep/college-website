"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { HOME_ABOUT } from "@/lib/content/design-portal";
import { LEADERSHIP_PROFILES } from "@/lib/content/leadership-profiles";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/** IIT Delhi — About | Campus media | Secretary's Corner (3-column row) */
export function HomeAboutSection() {
  const leader = LEADERSHIP_PROFILES[0];

  return (
    <section className="home-section bg-white">
      <div className="container-site">
        <HomeSectionHeading
          variant="centered"
          title="About the "
          accent="College"
          subtitle="Value-based education serving the Abujhmaria tribal community since 1985"
        />

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <RevealOnScroll className="lg:col-span-4 flex flex-col" delay={0}>
            <h3 className="text-base font-bold text-[#0D2660] uppercase tracking-wide mb-3">
              {HOME_ABOUT.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm flex-1">{HOME_ABOUT.excerpt}</p>
            <div className="flex flex-wrap gap-4 mt-5">
              <Link
                href={HOME_ABOUT.readMoreHref}
                className="micro-link-arrow inline-flex items-center gap-1 px-5 py-2 bg-[#B80F0A] hover:bg-[#9B1812] text-white text-xs font-bold uppercase tracking-wide micro-press micro-lift"
              >
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={HOME_ABOUT.newsletterHref}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#003366] hover:underline transition-colors"
              >
                News feed (RSS)
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-4 relative aspect-[4/3] lg:aspect-auto lg:min-h-[280px] overflow-hidden group micro-lift" delay={80}>
            <Image
              src="/images/ashrama-2.jpg"
              alt="Ramakrishna Mission Vivekananda College campus, Narayanpur"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-[#0D2660]/20 group-hover:bg-[#0D2660]/10 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="micro-icon-pop flex items-center justify-center w-14 h-14 rounded-full bg-[#B80F0A]/90 text-white shadow-lg group-hover:scale-110">
                <Play className="h-6 w-6 ml-0.5" aria-hidden="true" />
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-4 bg-[#2b2d3b] text-white flex flex-col micro-lift overflow-hidden group" delay={160}>
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-36 shrink-0 overflow-hidden">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2d3b] via-transparent to-transparent" />
            </div>
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <p className="text-[10px] font-bold text-[#F5C200] uppercase tracking-widest">
                Secretary&apos;s Corner
              </p>
              <h3 className="text-lg font-bold mt-1">{leader.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{leader.title} · {leader.org}</p>
              <p className="text-sm text-gray-300 leading-relaxed mt-3 line-clamp-4 flex-1">
                {leader.message}
              </p>
              <Link
                href={`/about/leadership/${leader.slug}`}
                className="micro-link-arrow inline-flex items-center gap-1 mt-4 text-xs font-bold uppercase tracking-wide text-[#F5C200] hover:text-white transition-colors"
              >
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
