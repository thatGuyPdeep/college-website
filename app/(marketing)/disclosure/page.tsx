import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText, CheckCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMergedDisclosure } from "@/lib/content/public-data";

export const metadata: Metadata = { title: "UGC Mandatory Disclosure" };

export default async function DisclosurePage() {
  const SECTIONS = await getMergedDisclosure();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2"><li><a href="/" className="hover:text-blue-700">Home</a></li><li>/</li><li aria-current="page">Mandatory Disclosure</li></ol>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">UGC Public Self-Disclosure</h1>
          <p className="text-gray-500 mt-2">As mandated by UGC Public Self-Disclosure Guidelines, 2024 and AICTE APH 2024–27 (Annexure-18)</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <Badge className="bg-green-100 text-green-800 border-green-300">NEP 2020 Compliant</Badge>
          <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2">
            <a href="/api/disclosure/pdf" download>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download full PDF
            </a>
          </Button>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-10 text-sm text-blue-800">
        <CheckCircle className="inline h-4 w-4 mr-2" aria-hidden="true" />
        All information is publicly accessible without login/registration, as required by UGC Guidelines.
        <strong className="block mt-1">Last reviewed: June 2026</strong>
      </div>

      <nav aria-label="Disclosure sections" className="flex flex-wrap gap-2 mb-10">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="text-xs bg-white border rounded-full px-3 py-1 hover:bg-blue-50 hover:text-blue-700 transition-colors">{s.label}</a>
        ))}
      </nav>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
            <h2 id={`${section.id}-heading`} className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">{section.label}</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {section.items.map((item) => (
                <li key={`${section.id}-${item.label}`}>
                  <a href={item.href}
                    className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm group"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                    <span className="flex items-center gap-2 text-gray-700 group-hover:text-blue-700">
                      <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-hidden="true" />
                      {item.label}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
