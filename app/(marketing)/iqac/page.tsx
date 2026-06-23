import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { IQAC_CONTENT } from "@/lib/content/reference-portal";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "IQAC",
  description: "Internal Quality Assurance Cell — AQAR, feedback, and accreditation.",
};

export default function IqacPage() {
  return (
    <MarketingPage
      title="Internal Quality Assurance Cell (IQAC)"
      hindiTitle="आंतरिक गुणवत्ता आश्वासन प्रकोष्ठ"
      description={IQAC_CONTENT.vision}
      breadcrumbs={[{ label: "Accreditations", href: "/disclosure" }]}
    >
      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Functions</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          {IQAC_CONTENT.functions.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section id="aqar" className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Documents</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {IQAC_CONTENT.documents.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]"
            >
              {doc.label} →
            </Link>
          ))}
        </div>
      </section>

      <section id="feedback" className="rounded-2xl border border-[#F5C200] bg-yellow-50 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[#0D2660] mb-2">Stakeholder Feedback</h2>
        <p className="text-sm text-gray-600 mb-6 max-w-xl">
          Students, parents, alumni, and faculty are invited to submit feedback for quality improvement and NAAC documentation.
        </p>
        <div className="max-w-lg bg-white rounded-xl p-5 border border-blue-100">
          <ContactForm
            defaultSubject="IQAC Feedback"
            defaultMessage="Role (Student/Parent/Faculty/Alumni): \nProgramme/Department: \n\nFeedback:"
          />
        </div>
      </section>
    </MarketingPage>
  );
}
