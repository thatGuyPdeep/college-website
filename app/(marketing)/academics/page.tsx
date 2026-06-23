import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PROGRAMS,
  ITI_TRADES,
  SCHOOL_STREAMS,
  BOARD_RESULTS,
  RKM_FACTS,
  EXTERNAL_LINKS,
} from "@/lib/utils/constants";
import { INTERIOR_CENTERS, SPORTS, VIDYAPEETH } from "@/lib/content/education";

export const metadata: Metadata = {
  title: "Academics — Programmes, ITI & School",
  description:
    "Undergraduate (NEP 2020 FYUGP) programmes affiliated to Bastar University, the Ramakrishna Mission ITI, and Vivekananda Vidyapeeth higher-secondary streams.",
};

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Programmes & Courses"
        description={`Value-based, man-making education from school to degree — undergraduate programmes under NEP 2020 affiliated to ${RKM_FACTS.university}, alongside free vocational training and residential schooling for the Abujhmaria tribal community.`}
      />

      <section className="section bg-white">
        <div className="container-site">
          <SectionHeader
            eyebrow="Higher Education"
            title="Undergraduate Programmes (FYUGP)"
            description="Four-Year Undergraduate Programmes under NEP 2020, with multiple entry–exit options (Certificate after Year 1, Diploma after Year 2, Degree after Year 3, Honours/Research in Year 4)."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {PROGRAMS.map((p) => (
              <Card key={p.slug} className="h-full border-blue-100 card-lift hover:border-[#0D2660]/30 transition-all">
                <CardContent className="p-5 sm:p-7 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="p-2.5 rounded-lg bg-blue-50 shrink-0">
                      <BookOpen className="h-5 w-5 text-[#0D2660]" aria-hidden="true" />
                    </div>
                    <span className="text-xs bg-blue-50 text-[#0D2660] border-0 font-semibold uppercase px-2 py-1 rounded-md shrink-0">
                      {p.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0D2660] mb-1 text-lg">{p.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{p.duration}</p>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{p.short}</p>
                  <ul className="mt-auto space-y-1.5 border-t border-blue-50 pt-3">
                    {p.highlights.map((h) => (
                      <li key={h} className="text-xs text-gray-500 flex items-start gap-2">
                        <span className="text-[#C8201A] mt-0.5">•</span> {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="w-full sm:w-auto bg-[#C8201A] hover:bg-[#9B1812] text-white font-semibold min-h-11">
              <Link href="/admissions/apply">Apply for Admission <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto border-[#0D2660] text-[#0D2660] min-h-11">
              <Link href="/academics/syllabus">Syllabus</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto border-[#0D2660] text-[#0D2660] min-h-11">
              <Link href="/academics/calendar">Academic Calendar</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto border-[#0D2660] text-[#0D2660] min-h-11">
              <Link href="/admissions/seats">Seats Availability</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="iti" className="section section-alt scroll-mt-28">
        <div className="container-site">
          <SectionHeader
            eyebrow="Vocational Training"
            title="Industrial Training Institute (ITI)"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-100 shadow-sm order-last lg:order-first">
              <Image
                src="/images/act-iti.jpg"
                alt="Ramakrishna Mission ITI, Narayanpur"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="text-gray-600 leading-relaxed">
              The Ramakrishna Mission ITI, Narayanpur is affiliated to the National Council for Vocational
              Training (NCVT) and provides <strong>free</strong> residential vocational training to tribal
              youth, equipping them with employable, industry-relevant skills across a range of engineering
              and non-engineering trades.
            </p>
          </div>

          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D2660] text-white text-left">
                  <th className="px-4 sm:px-5 py-3 font-semibold whitespace-nowrap">Trade</th>
                  <th className="px-4 sm:px-5 py-3 font-semibold whitespace-nowrap">Duration</th>
                  <th className="px-4 sm:px-5 py-3 font-semibold">Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {ITI_TRADES.map((t, i) => (
                  <tr key={t.name} className={i % 2 ? "bg-blue-50/40" : "bg-white"}>
                    <td className="px-4 sm:px-5 py-3 font-medium text-gray-800 min-w-[10rem]">{t.name}</td>
                    <td className="px-4 sm:px-5 py-3 text-gray-600 whitespace-nowrap">{t.duration}</td>
                    <td className="px-4 sm:px-5 py-3 text-gray-600">{t.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            <Link href="/academics/iti" className="text-[#0D2660] font-semibold hover:text-[#C8201A] mr-3">
              View full ITI details on this site →
            </Link>
            Official site:{" "}
            <a
              href={EXTERNAL_LINKS.iti}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D2660] font-semibold hover:text-[#C8201A] inline-flex items-center gap-1"
            >
              rkmitinpr.org <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <SectionHeader
              eyebrow="School Education"
              title="Vivekananda Vidyapeeth"
              description="A free residential higher-secondary school (Class 1–12) for tribal children of Abujhmarh, with over 2,730 students."
              className="mb-6"
            />
            <p className="text-sm text-gray-500 mb-4">Higher-secondary streams offered:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {SCHOOL_STREAMS.map((s) => (
                <span key={s} className="bg-blue-50 border border-blue-200 text-[#0D2660] text-sm font-medium rounded-full px-4 py-1.5">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Current strength: <strong>{VIDYAPEETH.strength.total.toLocaleString()}</strong> students
              ({VIDYAPEETH.strength.boys.toLocaleString()} boys, {VIDYAPEETH.strength.girls.toLocaleString()} girls).
              {VIDYAPEETH.pvtgNote}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Education is fully free — including boarding, lodging, books, uniforms and healthcare —
              in line with Swami Vivekananda&apos;s ideal that education must reach those who cannot
              come to it.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {["/images/school-1.jpg", "/images/school-2.jpg", "/images/school-3.jpg"].map((src) => (
                <div key={src} className="relative aspect-square rounded-xl overflow-hidden border border-blue-100">
                  <Image src={src} alt="Vivekananda Vidyapeeth" fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F0F4FF] rounded-2xl p-5 sm:p-7 border border-blue-100">
            <h3 className="font-bold text-[#0D2660] mb-4 text-lg">Board Results — Chhattisgarh Board</h3>
            <div className="table-responsive border-0 shadow-none">
              <table className="w-full text-sm min-w-[28rem]">
                <thead>
                  <tr className="text-left text-[#0D2660] border-b border-blue-200">
                    <th className="py-2 font-semibold">Year</th>
                    <th className="py-2 font-semibold">Class</th>
                    <th className="py-2 font-semibold">Appeared</th>
                    <th className="py-2 font-semibold">Passed</th>
                    <th className="py-2 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {BOARD_RESULTS.map((r) => (
                    <tr key={`${r.year}-${r.cls}`} className="border-b border-blue-100 last:border-0">
                      <td className="py-2.5 text-gray-600">{r.year}</td>
                      <td className="py-2.5 text-gray-800 font-medium">{r.cls}</td>
                      <td className="py-2.5 text-gray-600">{r.appeared}</td>
                      <td className="py-2.5 text-gray-600">{r.passed}</td>
                      <td className="py-2.5">
                        <span className="text-green-700 font-semibold">{r.percent}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader
            eyebrow="Interior Abujhmarh"
            title="Vivekananda Vidyamandirs"
            description={INTERIOR_CENTERS.intro}
            className="mb-8"
          />
          <p className="text-sm text-gray-600 mb-6">
            Total student strength across interior centres:{" "}
            <strong>{INTERIOR_CENTERS.totalStrength.total.toLocaleString()}</strong>{" "}
            ({INTERIOR_CENTERS.totalStrength.boys} boys, {INTERIOR_CENTERS.totalStrength.girls} girls).
          </p>
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D2660] text-white text-left">
                  <th className="px-4 py-3 font-semibold">Centre</th>
                  <th className="px-4 py-3 font-semibold">Boys</th>
                  <th className="px-4 py-3 font-semibold">Girls</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {INTERIOR_CENTERS.centers.map((c, i) => (
                  <tr key={c.name} className={i % 2 ? "bg-blue-50/40" : "bg-white"}>
                    <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.boys}</td>
                    <td className="px-4 py-3 text-gray-600">{c.girls}</td>
                    <td className="px-4 py-3 text-[#0D2660] font-semibold">{c.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <SectionHeader
            eyebrow="Holistic Development"
            title="Sports & Physical Education"
            description={SPORTS.intro}
            className="mb-8"
          />
          <p className="text-sm text-gray-600 mb-6">{SPORTS.nationalNote}</p>
          <div className="space-y-6">
            {SPORTS.participation.map((year) => (
              <div key={year.year} className="bg-[#F0F4FF] rounded-2xl p-5 sm:p-6 border border-blue-100">
                <h3 className="font-bold text-[#0D2660] mb-4">{year.year}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">State Level — {year.state.total} students</p>
                    <p className="text-gray-600">Football {year.state.football}, Kho-Kho {year.state.khoKho}, Gymnastics {year.state.gymnastics} (+ other disciplines)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">National Level — {year.national.total} students</p>
                    <p className="text-gray-600">Football {year.national.football}, Kho-Kho {year.national.khoKho}, Gymnastics {year.national.gymnastics}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
