import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { POLICY_SECTIONS } from "@/lib/content/policies";

export const metadata: Metadata = {
  title: "Policies & Guidelines",
  description: "Statutory policies, academic rules, and student welfare guidelines.",
};

export default function PoliciesPage() {
  return (
    <MarketingPage
      title="Policies & Guidelines"
      hindiTitle="नीतियाँ एवं दिशानिर्देश"
      description="Institutional policies as per UGC, NEP 2020, and affiliating university norms."
      breadcrumbs={[{ label: "Mandatory Disclosure", href: "/disclosure" }]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        {POLICY_SECTIONS.map((section) => (
          <section key={section.title} className="rounded-2xl border border-blue-100 bg-white p-6">
            <h2 className="font-bold text-[#0D2660] text-lg mb-4 pb-2 border-b border-blue-50">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#C8201A] font-medium"
                    >
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-gray-700 hover:text-[#C8201A] font-medium">
                      {link.label} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </MarketingPage>
  );
}
