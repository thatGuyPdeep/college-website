import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, GraduationCap, IndianRupee, HelpCircle, LayoutGrid } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdmissionsStatsStrip } from "@/components/marketing/AdmissionsStatsStrip";
import { RKM_FACTS } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Undergraduate admissions at Ramakrishna Mission Vivekananda College, Narayanpur — NEP 2020 FYUGP programmes affiliated to Bastar University.",
};

const LINKS = [
  {
    href:  "/admissions/how-to-apply",
    icon:  FileText,
    title: "How to Apply",
    desc:  "Step-by-step guide to the online application portal, documents, and deadlines.",
  },
  {
    href:  "/admissions/seats",
    icon:  LayoutGrid,
    title: "Seats Availability",
    desc:  "Programme-wise sanctioned intake for UG, ITI, and Vidyapeeth streams.",
  },
  {
    href:  "/admissions/fees",
    icon:  IndianRupee,
    title: "Fee Structure",
    desc:  "Programme-wise fees, payment modes, and refund policy overview.",
  },
  {
    href:  "/admissions/scholarships",
    icon:  GraduationCap,
    title: "Scholarships & Reservation",
    desc:  "Government scholarships, reservation categories, and financial aid.",
  },
  {
    href:  "/admissions/shortlist",
    icon:  FileText,
    title: "1st Shortlist",
    desc:  "First list of shortlisted students for session 2026–27.",
  },
  {
    href:  "/admissions/apply",
    icon:  ArrowRight,
    title: "Online Application",
    desc:  "Apply through the official SMKV Bastar University admission portal.",
  },
];

export default async function AdmissionsHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions 2026–27"
        title="Join Ramakrishna Mission Vivekananda College"
        description={`Undergraduate programmes under NEP 2020, affiliated to ${RKM_FACTS.university}. Value-based education serving Narayanpur and the Abujhmarh region.`}
      />
      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <AdmissionsStatsStrip compact />

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10 text-sm text-gray-700">
            <HelpCircle className="inline h-4 w-4 mr-2 text-[#0D2660]" aria-hidden="true" />
            Online applications for {RKM_FACTS.university} are submitted at{" "}
            <a
              href="https://smkvbastar.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0D2660] hover:underline"
            >
              smkvbastar.ac.in
            </a>
            . See programme-wise seats at our college below.
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {LINKS.map((l) => (
              <Card key={l.href} className="hover:shadow-md transition-shadow border-blue-100">
                <CardContent className="p-6">
                  <l.icon className="h-6 w-6 text-[#0D2660] mb-3" aria-hidden="true" />
                  <h2 className="font-semibold text-[#0D2660] mb-1">
                    <Link href={l.href} className="hover:underline">{l.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-600">{l.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-[#C8201A] hover:bg-[#9B1812] text-white">
              <Link href="/admissions/apply">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
              <Link href="/admissions/dashboard">Track Application</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/academics">Explore Programmes</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
