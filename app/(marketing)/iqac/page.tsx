import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { IQAC_CONTENT } from "@/lib/content/reference-portal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getPublicIqacDocuments } from "@/lib/content/public-data";

export const metadata: Metadata = {
  title: "IQAC",
  description: "Internal Quality Assurance Cell — AQAR, feedback, and accreditation.",
};

const STATIC_AQAR = [
  { label: "Mandatory Disclosure & quality documents", href: "/disclosure" },
  { label: "College Policies", href: "/policies" },
];

export default async function IqacPage() {
  const dbDocs = await getPublicIqacDocuments();
  const aqarDocs = dbDocs.filter((d) => d.category === "aqar" || d.category === "AQAR");
  const constitutionDocs = dbDocs.filter((d) => d.category === "constitution" || d.category === "policy");
  const otherDocs = dbDocs.filter((d) => !["aqar", "AQAR", "constitution", "policy"].includes(d.category));

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

      <section id="constitution" className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">IQAC Constitution & Policies</h2>
        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
          The IQAC is constituted as per NAAC guidelines with representatives from management, faculty, students,
          alumni, and local society. Minutes and constitution documents are published below.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {constitutionDocs.length > 0 ? (
            constitutionDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url ?? doc.link_url ?? "#"}
                target={doc.file_url?.startsWith("http") ? "_blank" : undefined}
                rel={doc.file_url?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]"
              >
                {doc.title}
                {doc.academic_year ? ` (${doc.academic_year})` : ""} →
              </a>
            ))
          ) : (
            IQAC_CONTENT.documents
              .filter((d) => d.href.includes("constitution"))
              .map((doc) => (
                <Link key={doc.href} href={doc.href} className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]">
                  {doc.label} →
                </Link>
              ))
          )}
          <Link href="/policies" className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]">
            College Policies →
          </Link>
        </div>
      </section>

      <section id="aqar" className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">AQAR Reports</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {aqarDocs.length > 0 ? (
            aqarDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url ?? doc.link_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]"
              >
                {doc.title}
                {doc.academic_year ? ` — ${doc.academic_year}` : ""} →
              </a>
            ))
          ) : (
            STATIC_AQAR.map((doc) => (
              <Link key={doc.label} href={doc.href} className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]">
                {doc.label} →
              </Link>
            ))
          )}
        </div>
      </section>

      {otherDocs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0D2660] mb-4">Other IQAC Documents</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url ?? doc.link_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]"
              >
                {doc.title} →
              </a>
            ))}
          </div>
        </section>
      )}

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
