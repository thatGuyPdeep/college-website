import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { CONTACT } from "@/lib/utils/constants";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="How we collect, use, and protect your personal data." />
      <section className="section bg-white">
        <div className="container-site max-w-3xl prose prose-sm">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8 not-prose">
            <Link href="/">Home</Link> / Privacy Policy
          </nav>

          <p className="text-gray-600">
            Ramakrishna Mission College, Narayanpur (&ldquo;we&rdquo;, &ldquo;the Institution&rdquo;) is committed to protecting your privacy
            in alignment with the Digital Personal Data Protection Act, 2023 (India).
          </p>

          <h2 className="text-lg font-semibold text-[#0D2660] mt-8">Data we collect</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Admission applications: name, contact, academic records, identity documents</li>
            <li>Faculty recruitment: CV, qualifications, experience</li>
            <li>Contact enquiries: name, email, message</li>
            <li>Website usage: anonymised analytics (if enabled)</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0D2660] mt-8">How we use data</h2>
          <p className="text-gray-600">
            Data is used solely for admission processing, recruitment, academic administration, and responding to enquiries.
            We do not sell personal data to third parties.
          </p>

          <h2 className="text-lg font-semibold text-[#0D2660] mt-8">Your rights</h2>
          <p className="text-gray-600">
            You may request access, correction, or deletion of your data by contacting{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-[#C8201A]">{CONTACT.email}</a>.
          </p>

          <h2 className="text-lg font-semibold text-[#0D2660] mt-8">Grievance redressal</h2>
          <p className="text-gray-600">
            For privacy-related complaints, contact the Grievance Officer at {CONTACT.phones[0]} or see our{" "}
            <Link href="/disclosure" className="text-[#C8201A]">Mandatory Disclosure</Link> page.
          </p>

          <p className="text-xs text-gray-400 mt-10">Last updated: June 2026</p>
        </div>
      </section>
    </>
  );
}
