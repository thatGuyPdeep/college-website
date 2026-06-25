import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { GOVERNANCE_CONTENT } from "@/lib/content/reference-portal";

export const metadata: Metadata = {
  title: "Governance",
  description: "Governing body, academic council, and institutional governance at Ramakrishna Mission Vivekananda College.",
};

export default function GovernancePage() {
  return (
    <MarketingPage
      title="Governance"
      hindiTitle="शासन"
      description="Institutional governance under Ramakrishna Mission and Bastar University affiliation."
      breadcrumbs={[{ label: "About", href: "/about" }]}
    >
      <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">{GOVERNANCE_CONTENT.intro}</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {GOVERNANCE_CONTENT.bodies.map((body) => (
          <section key={body.title} className="rounded-2xl border border-blue-100 bg-white p-6 card-lift">
            <h2 className="font-bold text-[#0D2660] mb-2">{body.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{body.description}</p>
          </section>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Documents & Compliance</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {GOVERNANCE_CONTENT.documents.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm font-medium text-[#0D2660]"
              {...(doc.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {doc.label} →
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <Link href="/about/organization" className="text-sm font-semibold text-[#C8201A] hover:underline">
          View full organizational structure →
        </Link>
      </section>
    </MarketingPage>
  );
}
