import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { STUDENTS_CORNER_LINKS } from "@/lib/content/reference-portal";
import { HOSTEL_ELIGIBILITY } from "@/lib/content/hostel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Students' Corner",
  description: "Student support, hostel, NSS, portals, and welfare resources.",
};

export default function StudentsCornerPage() {
  return (
    <MarketingPage
      title="Students' Corner"
      hindiTitle="छात्र कोना"
      description="Academic support, hostel, welfare cells, and student portals."
      breadcrumbs={[]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        {STUDENTS_CORNER_LINKS.map((group) => (
          <section key={group.title} className="rounded-2xl border border-blue-100 bg-white p-6">
            <h2 className="font-bold text-[#0D2660] text-lg mb-4 pb-2 border-b border-blue-50">
              {group.title}
            </h2>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-700 hover:text-[#C8201A] font-medium">
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section id="welfare" className="mt-10 rounded-2xl navy-gradient text-white p-8">
        <h2 className="text-xl font-bold mb-2">Dean / Student Welfare & Ombudsperson</h2>
        <p className="text-blue-100 text-sm mb-4 max-w-2xl">
          For counselling, discipline, anti-ragging, and student welfare matters — contact the college office.
          Grievances may also be filed through the SGRC or Anti-Ragging Cell.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-[#F5C200] text-[#0D2660] hover:bg-[#D4A800]">
            <Link href="/contact?subject=Student%20Welfare">Contact Student Services</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10">
            <Link href="/cells/sgrc">Grievance Redressal</Link>
          </Button>
        </div>
      </section>

      <section id="nss" className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="font-bold text-green-900 mb-2">National Service Scheme (NSS)</h2>
        <p className="text-sm text-green-800 mb-4">
          NSS unit activities include community service, health camps, and literacy drives in tribal villages.
        </p>
        <Button asChild variant="outline" className="border-green-800 text-green-900 hover:bg-green-100">
          <Link href="/nss">NSS Page →</Link>
        </Button>
      </section>

      <section id="hostel-apply" className="mt-8 rounded-xl border border-blue-100 bg-[#F0F4FF] p-6">
        <h2 className="font-bold text-[#0D2660] mb-2">Hostel Application</h2>
        <p className="text-sm text-gray-600 mb-4">{HOSTEL_ELIGIBILITY}</p>
        <p className="text-sm text-gray-600 mb-4">
          Eligible Abujhmarh students in Mission residential programmes may download the form or contact the
          warden.
        </p>
        <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
          <Link href="/forms#hostel">Download Hostel Form</Link>
        </Button>
      </section>
    </MarketingPage>
  );
}
