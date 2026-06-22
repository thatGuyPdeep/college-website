import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { HISTORY_SECTIONS, VIVEKANANDA_QUOTE } from "@/lib/content/history";

export const metadata: Metadata = {
  title: "History of Ashrama",
  description:
    "The history of Ramakrishna Mission Ashrama, Narayanpur — serving the Abujhmaria tribal community in Abujhmarh since 1985.",
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="History of Ashrama"
        description="Four decades of service to the Abujhmaria tribal community in the remote Abujhmarh highlands of Chhattisgarh."
      />

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <Link href="/about" className="inline-flex items-center gap-1 text-sm text-[#0D2660] hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>

          <div className="space-y-10">
            {HISTORY_SECTIONS.map((section) => (
              <article key={section.title}>
                <h2 className="text-xl font-bold text-[#0D2660] mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <blockquote className="mt-12 bg-[#F0F4FF] border-l-4 border-[#C8201A] rounded-r-xl p-6 flex gap-4">
            <Quote className="h-6 w-6 text-[#C8201A] shrink-0 mt-1" aria-hidden="true" />
            <div>
              <p className="text-gray-700 italic leading-relaxed">&ldquo;{VIVEKANANDA_QUOTE}&rdquo;</p>
              <footer className="text-sm text-gray-500 mt-2">— Swami Vivekananda</footer>
            </div>
          </blockquote>

          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            <Link href="/about/awards" className="text-[#0D2660] font-semibold hover:underline">Awards & Recognition →</Link>
            <Link href="/vision-mission" className="text-[#0D2660] font-semibold hover:underline">Vision & Mission →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
