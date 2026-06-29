import type { Metadata } from "next";
import Link from "next/link";
import { Download, Home } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HOSTEL_APPLY_STEPS, HOSTEL_ELIGIBILITY, HOSTEL_FACILITIES, HOSTEL_RULES } from "@/lib/content/hostel";
import { HostelEnquiryForm } from "@/components/hostel/HostelEnquiryForm";

export const metadata: Metadata = {
  title: "Hostel",
  description:
    "Residential hostel facilities at Ramakrishna Mission Ashrama, Narayanpur — for Abujhmarh students in Mission programmes only.",
};

export default function HostelPage() {
  return (
    <>
      <PageHero
        eyebrow="Campus Life"
        title="Student Hostels"
        description="Residential facilities for Abujhmarh students in Mission programmes — not available to all college students."
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/campus/infrastructure">Campus</Link> / Hostel
          </nav>

          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 text-sm text-amber-950">
            <p className="font-semibold text-amber-900 mb-1">Eligibility</p>
            <p>{HOSTEL_ELIGIBILITY}</p>
          </div>

          <Card className="mb-8 border-blue-100">
            <CardContent className="p-6 sm:p-8 space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                The Ramakrishna Mission Ashrama provides <strong>free residential</strong> schooling and hostel
                facilities exclusively for students from Abujhmarh through Vivekananda Vidyapeeth, six interior
                Vivekananda Vidyamandirs, and residential ITI training — not for general undergraduate day
                scholars.
              </p>
              <p>
                Hostel life emphasises discipline, study hours, and spiritual values in line with the
                Mission&apos;s man-making education philosophy.
              </p>
            </CardContent>
          </Card>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-[#0D2660] mb-4 flex items-center gap-2">
              <Home className="h-5 w-5" aria-hidden="true" /> Facilities
            </h2>
            <ul className="divide-y rounded-xl border border-blue-100 overflow-hidden">
              {HOSTEL_FACILITIES.map((f) => (
                <li key={f.label} className="flex justify-between gap-4 p-4 bg-white text-sm">
                  <span className="font-medium text-gray-800">{f.label}</span>
                  <span className="text-gray-500 text-right">{f.value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="apply" className="mb-10 scroll-mt-24">
            <h2 className="text-lg font-bold text-[#0D2660] mb-4">Apply for Hostel</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mb-6">
              {HOSTEL_APPLY_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-[#0D2660] hover:bg-[#071540]">
                <Link href="/forms#hostel">
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download Hostel Form
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
                <Link href="/contact?subject=Hostel%20Admission">Contact Warden</Link>
              </Button>
            </div>

            <div className="mt-8 rounded-xl border border-blue-100 bg-[#F0F4FF] p-6">
              <h3 className="font-bold text-[#0D2660] mb-2">Online Hostel Enquiry</h3>
              <p className="text-sm text-gray-600 mb-4">
                Submit details below for Mission residential programmes (Vidyapeeth / Vidyamandir / ITI hostel).
                The warden office will respond within 3–5 working days.
              </p>
              <HostelEnquiryForm />
            </div>
          </section>

          <section id="rules" className="mb-10 scroll-mt-24">
            <h2 className="text-lg font-bold text-[#0D2660] mb-4">Hostel Rules (Summary)</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {HOSTEL_RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/cells/anti-ragging" className="text-[#C8201A] font-semibold hover:underline">
                Anti-Ragging Cell →
              </Link>
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Queries: <a href="tel:+917781252251" className="text-[#C8201A]">07781-252251</a> ·{" "}
            <Link href="/contact" className="text-[#C8201A] hover:underline">Contact page</Link>
          </p>
        </div>
      </section>
    </>
  );
}
