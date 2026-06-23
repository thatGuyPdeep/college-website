import type { Metadata } from "next";
import Link from "next/link";
import { Download, Home } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HOSTEL_APPLY_STEPS, HOSTEL_FACILITIES, HOSTEL_RULES } from "@/lib/content/hostel";

export const metadata: Metadata = { title: "Hostel" };

export default function HostelPage() {
  return (
    <>
      <PageHero
        eyebrow="Campus Life"
        title="Student Hostels"
        description="Residential facilities for tribal students at Ramakrishna Mission Ashrama, Narayanpur."
      />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/campus/infrastructure">Campus</Link> / Hostel
          </nav>

          <Card className="mb-8 border-blue-100">
            <CardContent className="p-6 sm:p-8 space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                The Ramakrishna Mission Ashrama provides <strong>free residential</strong> schooling and hostel
                facilities for tribal students from the Abujhmaria community through Vivekananda Vidyapeeth,
                ITI residential training, and associated programmes.
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
          </section>

          <section className="mb-10">
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
