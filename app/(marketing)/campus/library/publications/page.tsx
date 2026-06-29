import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { getPublicPublications } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "Library Publications",
  description: "Online reading — Ramakrishna Math & Mission publications and digital resources.",
};

export default async function LibraryPublicationsPage() {
  const pubs = await getPublicPublications();

  return (
    <MarketingPage
      title="Publications & Online Reading"
      hindiTitle="प्रकाशन एवं ऑनलाइन पठन"
      description={pubs.hub.tagline}
      breadcrumbs={[
        { label: "Library", href: "/campus/library" },
        { label: "E-Resources", href: "/campus/library/e-resources" },
      ]}
    >
      <a
        href={pubs.hub.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#0D2660] text-white font-semibold rounded-md px-5 py-2.5 mb-8 hover:bg-[#071540] transition-colors"
      >
        Visit publications.rkmm.org <ExternalLink className="h-4 w-4" />
      </a>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">English</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {pubs.english.map((item) => (
            <li key={item.href + item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-blue-100 hover:bg-blue-50 text-sm text-[#0D2660]"
              >
                {item.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Hindi & Indian Languages</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {pubs.indianLanguages.map((item) => (
            <li key={item.href + item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-blue-100 hover:bg-blue-50 text-sm text-[#0D2660]"
              >
                {item.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm">
        <Link href="/campus/library" className="text-[#0D2660] font-semibold hover:underline">
          ← Central Library
        </Link>
      </p>
    </MarketingPage>
  );
}
