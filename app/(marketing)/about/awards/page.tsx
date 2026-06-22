import type { Metadata } from "next";
import Link from "next/link";
import { Award, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { AWARDS_DETAILED, AWARDS_INTRO } from "@/lib/content/awards";

export const metadata: Metadata = {
  title: "Awards & Recognition",
  description: "National and state awards conferred on Ramakrishna Mission Ashrama, Narayanpur for education, healthcare, and tribal uplift.",
};

export default function AwardsPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Awards & Recognition"
        description={AWARDS_INTRO}
      />

      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <Link href="/about" className="inline-flex items-center gap-1 text-sm text-[#0D2660] hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>

          <ol className="space-y-6">
            {AWARDS_DETAILED.map((award, i) => (
              <li key={`${award.year}-${award.title}`} className="flex gap-4 bg-[#F0F4FF] rounded-xl p-5 sm:p-6 border border-blue-100">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#0D2660] flex items-center justify-center text-[#F5C200] border-2 border-[#F5C200]" aria-hidden="true">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-center text-xs font-bold text-[#0D2660] mt-2">{award.year}</p>
                </div>
                <div>
                  <h2 className="font-bold text-[#0D2660] text-lg mb-2">
                    <span className="sr-only">Award {i + 1}: </span>
                    {award.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{award.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
