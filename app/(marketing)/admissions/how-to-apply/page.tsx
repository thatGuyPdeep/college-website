import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { REQUIRED_DOCUMENTS } from "@/lib/utils/constants";

export const metadata: Metadata = { title: "How to Apply" };

const STEPS = [
  { n: 1, title: "Create account", body: "Sign in with your email. Verify OTP sent to your inbox (check spam if needed)." },
  { n: 2, title: "Choose programme", body: "Select your preferred UG programme under NEP 2020 FYUGP from the list." },
  { n: 3, title: "Fill application", body: "Complete personal, academic, and category details. Progress auto-saves as you go." },
  { n: 4, title: "Upload documents", body: "Upload clear scans of required certificates (PDF/JPG, max 5 MB each)." },
  { n: 5, title: "Pay & submit", body: "Pay the application fee online and submit. Download your receipt PDF from the dashboard." },
];

export default function HowToApplyPage() {
  return (
    <>
      <PageHero eyebrow="Admissions" title="How to Apply" description="Online application process for undergraduate admissions." />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/admissions">Admissions</Link> / How to Apply
          </nav>

          <ol className="space-y-6 mb-10">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D2660] text-white text-sm font-bold">{s.n}</span>
                <div>
                  <h2 className="font-semibold text-gray-900">{s.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="text-lg font-semibold text-[#0D2660] mb-3">Required Documents</h2>
          <ul className="grid sm:grid-cols-2 gap-2 mb-8 text-sm text-gray-600">
            {REQUIRED_DOCUMENTS.map((d) => (
              <li key={d.type} className="flex gap-2"><span className="text-[#C8201A]">•</span>{d.label}</li>
            ))}
          </ul>

          <Button asChild className="bg-[#C8201A] hover:bg-[#9B1812] text-white">
            <Link href="/admissions/apply">Start Application <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
