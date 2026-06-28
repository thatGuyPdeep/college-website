import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { DOWNLOAD_FORMS } from "@/lib/content/reference-portal";
import { HOSTEL_ELIGIBILITY } from "@/lib/content/hostel";

export const metadata: Metadata = {
  title: "Download Forms",
  description: "Admission, hostel, anti-ragging, and certificate request forms.",
};

export default function FormsPage() {
  return (
    <MarketingPage
      title="Download Forms"
      hindiTitle="प्रपत्र डाउनलोड"
      description="Application forms, affidavits, and certificate requests."
      breadcrumbs={[]}
    >
      <ul className="divide-y rounded-2xl border border-blue-100 bg-white overflow-hidden">
        {DOWNLOAD_FORMS.map((form) => (
          <li key={form.label}>
            <Link
              href={form.href}
              className="flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-blue-50 transition-colors group"
            >
              <span className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-[#0D2660] shrink-0" aria-hidden="true" />
                <span className="font-medium text-gray-800 group-hover:text-[#0D2660]">{form.label}</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                {form.size}
                <Download className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section id="hostel" className="mt-10 scroll-mt-24">
        <h2 className="font-bold text-[#0D2660] mb-2">Hostel Application</h2>
        <p className="text-sm text-gray-600 mb-3">{HOSTEL_ELIGIBILITY}</p>
        <p className="text-sm text-gray-600 mb-3">
          Eligible Abujhmarh students in Vidyapeeth or residential ITI programmes may submit the completed form
          at the Ashrama office.
        </p>
        <Link href="/campus/hostel#apply" className="text-[#C8201A] font-semibold hover:underline text-sm">
          Hostel admission process →
        </Link>
      </section>

      <section id="tc" className="mt-10 scroll-mt-24">
        <h2 className="font-bold text-[#0D2660] mb-2">Transfer Certificate</h2>
        <p className="text-sm text-gray-600">
          Request TC through the college office with clearance from departments and library.{" "}
          <Link href="/contact?subject=Transfer%20Certificate" className="text-[#C8201A] font-semibold hover:underline">
            Contact office
          </Link>
        </p>
      </section>

      <section id="character" className="mt-10 scroll-mt-24">
        <h2 className="font-bold text-[#0D2660] mb-2">Character Certificate</h2>
        <p className="text-sm text-gray-600">
          Apply in person or via email with student ID and purpose of certificate.{" "}
          <Link href="/contact?subject=Character%20Certificate" className="text-[#C8201A] font-semibold hover:underline">
            Request certificate
          </Link>
        </p>
      </section>

      <section id="migration" className="mt-10 scroll-mt-24">
        <h2 className="font-bold text-[#0D2660] mb-2">Migration Certificate</h2>
        <p className="text-sm text-gray-600">
          Required for university transfers — contact the admissions office with mark sheets and ID proof.
        </p>
      </section>

      <section id="anti-ragging" className="mt-10 scroll-mt-24">
        <h2 className="font-bold text-[#0D2660] mb-2">Anti-Ragging Affidavit</h2>
        <p className="text-sm text-gray-600">
          Students and parents must submit the anti-ragging affidavit at admission.{" "}
          <Link href="/cells/anti-ragging" className="text-[#C8201A] font-semibold hover:underline">
            Anti-Ragging Cell →
          </Link>
        </p>
      </section>
    </MarketingPage>
  );
}
