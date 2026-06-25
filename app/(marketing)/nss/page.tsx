import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { NSS_CONTENT } from "@/lib/content/reference-portal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NSS",
  description: "National Service Scheme unit — community service and outreach at Ramakrishna Mission Vivekananda College.",
};

export default function NssPage() {
  return (
    <MarketingPage
      title="National Service Scheme (NSS)"
      hindiTitle="राष्ट्रीय सेवा योजना"
      description="Community service, health camps, and village outreach in Narayanpur and Abujhmarh."
      breadcrumbs={[{ label: "Students' Corner", href: "/students-corner" }]}
    >
      <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">{NSS_CONTENT.about}</p>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Activities</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          {NSS_CONTENT.activities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Reports & Gallery</h2>
        <div className="flex flex-wrap gap-3">
          {NSS_CONTENT.reports.map((link) => (
            <Button key={link.href} asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="font-bold text-green-900 mb-2">Volunteer with NSS</h2>
        <p className="text-sm text-green-800 mb-4">
          Enrolled students may join the NSS unit through the college office at the start of each session.
        </p>
        <Button asChild className="bg-green-800 hover:bg-green-900">
          <Link href="/contact?subject=NSS%20Enrollment">Contact NSS Coordinator</Link>
        </Button>
      </section>
    </MarketingPage>
  );
}
