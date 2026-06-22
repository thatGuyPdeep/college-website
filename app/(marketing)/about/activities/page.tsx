import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ACTIVITIES_INTRO, ACTIVITY_SECTIONS } from "@/lib/content/activities";
import { ASHRAMA_ACTIVITIES } from "@/lib/content/site-info";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Service Activities",
  description:
    "Education, healthcare, rural development and vocational training programmes of Ramakrishna Mission Ashrama, Narayanpur in Abujhmarh.",
};

const ACTIVITY_IMAGES: Record<string, string> = {
  education:  "/images/act-education.jpg",
  healthcare: "/images/act-healthcare.jpg",
  rural:      "/images/act-rural.jpg",
  vocational: "/images/act-iti.jpg",
  coaching:   "/images/act-coaching.jpg",
  ancillary:  "/images/act-ancillary.jpg",
  sports:     "/images/act-sports.jpg",
  vishwas:    "/images/act-vishwas.jpg",
};

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="About the Mission"
        title="Service Activities"
        description={ACTIVITIES_INTRO}
      />

      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <Link href="/about" className="inline-flex items-center gap-1 text-sm text-[#0D2660] hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {ASHRAMA_ACTIVITIES.map((a) => (
              <a
                key={a.slug}
                href={a.href.startsWith("/academics") ? a.href : `/about/activities#${a.slug === "rural-development" ? "rural" : a.slug === "iti" ? "vocational" : a.slug}`}
                className="group flex flex-col items-center text-center p-2 rounded-xl border border-blue-100 hover:border-[#0D2660]/30 card-lift"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#F5C200]/50 mb-1.5">
                  <Image src={a.img} alt={a.title} fill className="object-cover" sizes="56px" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#0D2660] leading-snug">{a.title}</span>
              </a>
            ))}
          </div>

          <div className="space-y-16">
            {ACTIVITY_SECTIONS.map((section) => (
              <article key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden border border-blue-100 shrink-0">
                    <Image
                      src={ACTIVITY_IMAGES[section.id] ?? "/images/ashrama-1.jpg"}
                      alt={section.title}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-[#0D2660] mb-3">{section.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-5">{section.summary}</p>
                    <ul className="space-y-2">
                      {section.highlights.map((h) => (
                        <li key={h.slice(0, 40)} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                          <span className="text-[#C8201A] font-bold shrink-0" aria-hidden="true">•</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                    {section.id === "vocational" && (
                      <Button asChild className="mt-5 bg-[#0D2660] text-white">
                        <Link href="/academics/iti">View ITI Programmes <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    )}
                    {section.id === "education" && (
                      <Button asChild variant="outline" className="mt-5 border-[#0D2660] text-[#0D2660]">
                        <Link href="/academics">View Academics <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
              <Link href="/donate">Support Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
