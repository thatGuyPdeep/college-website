import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { EXTERNAL_LINKS, RKM_FACTS, REQUIRED_DOCUMENTS, SITE_FULL_NAME } from "@/lib/utils/constants";
import { ADMISSIONS_SESSION } from "@/lib/content/admissions-2026";

export const metadata: Metadata = {
  title: "Apply for Admission",
  description: `Admission to ${SITE_FULL_NAME} is processed through Shaheed Mahendra Karma Vishwavidyalaya (Bastar University). Apply online at smkvbastar.ac.in.`,
};

const SMKV_PORTAL = EXTERNAL_LINKS.smkvUniversity;

const STEPS = [
  {
    n: 1,
    title: "Visit the university portal",
    body: "Open the official SMKV Bastar website and go to Admission → Online Admission for UG/PG programmes.",
  },
  {
    n: 2,
    title: "Select our college",
    body: `Choose Ramakrishna Mission Vivekananda College, Narayanpur when applying for affiliated undergraduate programmes (${ADMISSIONS_SESSION}).`,
  },
  {
    n: 3,
    title: "Complete the online form",
    body: "Fill in personal and academic details, upload documents, and pay the application fee as instructed on the university portal.",
  },
  {
    n: 4,
    title: "Track merit & admission",
    body: "Merit lists and admission notices are published on smkvbastar.ac.in. Contact the college office for any local queries.",
  },
] as const;

/** Public notice — admissions are handled on the affiliated university portal */
export default function ApplyAdmissionNoticePage() {
  return (
    <>
      <PageHero
        eyebrow="Important Announcement"
        title="Apply Through Bastar University"
        description={`${SITE_FULL_NAME} is affiliated to ${RKM_FACTS.university}. Online admission applications are submitted on the university portal.`}
      />

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/admissions" className="hover:text-[#0D2660]">
              Admissions
            </Link>
            {" / "}
            <span className="text-[#0D2660] font-medium">Apply Online</span>
          </nav>

          <RevealOnScroll>
            <div
              className="rounded-xl border-2 border-[#B80F0A]/30 bg-[#fff8f8] p-5 sm:p-6 mb-8"
              role="alert"
            >
              <div className="flex gap-3 sm:gap-4">
                <AlertCircle className="h-8 w-8 text-[#B80F0A] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0D2660] leading-snug">
                    Apply on the official university website
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 mt-2 leading-relaxed">
                    To apply for admission to undergraduate and other university-affiliated programmes at{" "}
                    <strong>{SITE_FULL_NAME}</strong>, please use the online admission portal of{" "}
                    <strong>Shaheed Mahendra Karma Vishwavidyalaya (Bastar University)</strong> — not this
                    college website.
                  </p>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    This follows the same process used by all SMKV-affiliated colleges. Session{" "}
                    <strong>{ADMISSIONS_SESSION}</strong> applications, merit lists, and notices are published on{" "}
                    <a
                      href={SMKV_PORTAL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#B80F0A] hover:underline"
                    >
                      smkvbastar.ac.in
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
              <Button
                asChild
                size="lg"
                className="bg-[#B80F0A] hover:bg-[#9B1812] text-white micro-lift micro-press"
              >
                <a href={SMKV_PORTAL} target="_blank" rel="noopener noreferrer">
                  Go to smkvbastar.ac.in
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#0D2660] text-[#0D2660]">
                <Link href="/admissions/seats">
                  Seats at our college
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/admissions/how-to-apply">Admission guide</Link>
              </Button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <h2 className="text-lg font-bold text-[#0D2660] mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#B80F0A]" aria-hidden="true" />
              How to apply ({ADMISSIONS_SESSION})
            </h2>
            <ol className="space-y-5 mb-10">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D2660] text-white text-sm font-bold">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </RevealOnScroll>

          <RevealOnScroll delay={140}>
            <h2 className="text-lg font-bold text-[#0D2660] mb-3">Documents required for admission</h2>
            <p className="text-sm text-gray-600 mb-3">
              Upload these when completing your application on the university portal (PDF/JPG, typically max 5 MB
              each):
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 mb-10 text-sm text-gray-600">
              {REQUIRED_DOCUMENTS.map((d) => (
                <li key={d.type} className="flex gap-2">
                  <span className="text-[#C8201A]">•</span>
                  {d.label}
                </li>
              ))}
            </ul>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <div className="rounded-xl border border-blue-100 bg-[#F0F4FF] p-5 sm:p-6 text-sm text-gray-700">
              <h2 className="font-bold text-[#0D2660] mb-3">College contact (for queries)</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#B80F0A] shrink-0 mt-0.5" aria-hidden="true" />
                  Ramakrishna Mission Ashrama, Narayanpur, Dist. Narayanpur, Chhattisgarh – 494 661
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#B80F0A] shrink-0" aria-hidden="true" />
                  <a href="tel:+917781252251" className="hover:text-[#0D2660]">
                    07781-252251
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#B80F0A] shrink-0" aria-hidden="true" />
                  <a href="mailto:rkm.narainpur@gmail.com" className="hover:text-[#0D2660] break-all">
                    rkm.narainpur@gmail.com
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                University portal:{" "}
                <a
                  href={SMKV_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D2660] font-medium hover:underline"
                >
                  {SMKV_PORTAL}
                </a>
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
