import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { EXTERNAL_LINKS, RKM_FACTS, REQUIRED_DOCUMENTS } from "@/lib/utils/constants";
import { ADMISSIONS_SESSION } from "@/lib/content/admissions-2026";

export const metadata: Metadata = { title: "How to Apply" };

const STEPS = [
  {
    n: 1,
    title: "Open the university portal",
    body: "Visit smkvbastar.ac.in and navigate to Admission → Online Admission for the current academic session.",
  },
  {
    n: 2,
    title: "Select our college",
    body: `Choose Ramakrishna Mission Vivekananda College, Narayanpur when applying for programmes affiliated to ${RKM_FACTS.university}.`,
  },
  {
    n: 3,
    title: "Fill the application",
    body: "Complete personal, academic, and category details on the university portal. Upload documents as instructed (PDF/JPG, typically max 5 MB each).",
  },
  {
    n: 4,
    title: "Pay fee & submit",
    body: "Pay the application fee through the university portal and submit. Save your application number for future reference.",
  },
  {
    n: 5,
    title: "Check merit lists",
    body: "Merit lists and admission notices are published on smkvbastar.ac.in. Contact the college office for local assistance.",
  },
];

export default function HowToApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="How to Apply"
        description={`Online admission for ${ADMISSIONS_SESSION} is processed through Shaheed Mahendra Karma Vishwavidyalaya (Bastar University).`}
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/admissions">Admissions</Link> / How to Apply
          </nav>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 mb-8">
            Applications are <strong>not</strong> submitted on this college website. Use the official portal at{" "}
            <a
              href={EXTERNAL_LINKS.smkvUniversity}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              smkvbastar.ac.in
            </a>
            .
          </div>

          <ol className="space-y-6 mb-10">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D2660] text-white text-sm font-bold">
                  {s.n}
                </span>
                <div>
                  <h2 className="font-semibold text-gray-900">{s.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Documents required for admission</h2>
          <p className="text-sm text-gray-600 mb-3">
            Keep scanned copies ready before applying on the university portal:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 mb-8 text-sm text-gray-600">
            {REQUIRED_DOCUMENTS.map((d) => (
              <li key={d.type} className="flex gap-2">
                <span className="text-[#C8201A]">•</span>
                {d.label}
              </li>
            ))}
          </ul>

          <Button asChild className="bg-[#C8201A] hover:bg-[#9B1812] text-white">
            <Link href="/admissions/apply">
              Apply on university portal
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
