import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import type { ExamDocument } from "@/lib/content/examination-portal";
import { EXAMINATION_OFFICE } from "@/lib/content/examination-portal";

type ExaminationListingPageProps = {
  title: string;
  hindiTitle?: string;
  description: string;
  items: ExamDocument[];
  steps?: string[];
  intro?: string;
  externalCta?: { label: string; href: string };
};

export function ExaminationListingPage({
  title,
  hindiTitle,
  description,
  items,
  steps,
  intro,
  externalCta,
}: ExaminationListingPageProps) {
  return (
    <MarketingPage
      title={title}
      hindiTitle={hindiTitle}
      description={description}
      breadcrumbs={[{ label: "Examination", href: "/examination" }]}
    >
      {intro && <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">{intro}</p>}

      {externalCta && (
        <div className="mb-6">
          <a
            href={externalCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D2660] text-white text-sm font-semibold hover:bg-[#071540] transition-colors"
          >
            {externalCta.label}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      )}

      <ul className="divide-y rounded-lg border border-gray-200 bg-white overflow-hidden">
        {items.map((doc) => (
          <li key={`${doc.title}-${doc.href}`}>
            {doc.external ? (
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-4 sm:p-5 hover:bg-blue-50/50 transition-colors group"
              >
                <span className="flex items-start gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-gray-800 group-hover:text-[#0D2660] block leading-snug">
                      {doc.title}
                    </span>
                    {doc.note && <span className="text-xs text-gray-500 mt-1 block">{doc.note}</span>}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-400 shrink-0 sm:pt-1">
                  {doc.date && <time>{doc.date}</time>}
                  {doc.language && <span>[{doc.language}]</span>}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            ) : (
              <Link
                href={doc.href}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-4 sm:p-5 hover:bg-blue-50/50 transition-colors group"
              >
                <span className="flex items-start gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-gray-800 group-hover:text-[#0D2660] block leading-snug">
                      {doc.title}
                    </span>
                    {doc.note && <span className="text-xs text-gray-500 mt-1 block">{doc.note}</span>}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-400 shrink-0 sm:pt-1">
                  {doc.date && <time>{doc.date}</time>}
                  {doc.language && <span>[{doc.language}]</span>}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {steps && steps.length > 0 && (
        <section className="mt-8 rounded-lg border border-blue-100 bg-[#F0F4FF] p-5 sm:p-6">
          <h2 className="font-bold text-[#0D2660] mb-3">Procedure</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        <h2 className="font-bold text-[#0D2660] mb-2">Examination Control Room</h2>
        <p>
          Email:{" "}
          <a href={`mailto:${EXAMINATION_OFFICE.email}`} className="text-[#C8201A] hover:underline">
            {EXAMINATION_OFFICE.email}
          </a>
          {" · "}
          Phone:{" "}
          <a href="tel:+917781252251" className="text-[#C8201A] hover:underline">
            {EXAMINATION_OFFICE.phone}
          </a>
        </p>
        <p className="mt-1">{EXAMINATION_OFFICE.hours}</p>
      </section>
    </MarketingPage>
  );
}
