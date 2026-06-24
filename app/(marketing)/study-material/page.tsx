import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { STUDY_MATERIAL_LINKS } from "@/lib/content/reference-portal";

export const metadata: Metadata = {
  title: "Online Study Material",
  description: "Syllabus, e-learning portals, question papers, and Mission publications.",
};

export default function StudyMaterialPage() {
  return (
    <MarketingPage
      title="Online Study Material"
      hindiTitle="ऑनलाइन अध्ययन सामग्री"
      description="College syllabus, library e-resources, and national e-learning platforms."
      breadcrumbs={[{ label: "Academics", href: "/academics" }]}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STUDY_MATERIAL_LINKS.map((group) => (
          <section key={group.category} className="rounded-2xl border border-blue-100 bg-white p-6">
            <h2 className="font-bold text-[#0D2660] text-lg mb-4 pb-2 border-b border-blue-50">
              {group.category}
            </h2>
            <ul className="space-y-2">
              {group.links.map((link) => (
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
