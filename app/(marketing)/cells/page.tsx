import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { STATUTORY_CELLS } from "@/lib/content/reference-portal";

export const metadata: Metadata = {
  title: "Statutory Cells",
  description: "RTI, anti-ragging, grievance redressal, and other statutory cells.",
};

export default function CellsIndexPage() {
  return (
    <MarketingPage
      title="Statutory Cells"
      hindiTitle="प्रकोष्ठ"
      description="Compliance cells for grievance redressal, RTI, anti-ragging, and welfare — as per UGC and state university norms."
      breadcrumbs={[]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATUTORY_CELLS.map((cell) => (
          <Link
            key={cell.slug}
            href={`/cells/${cell.slug}`}
            className="block p-5 rounded-2xl border border-blue-100 bg-white hover:border-[#0D2660]/30 hover:bg-[#F0F4FF] card-lift transition-colors"
          >
            <p className="devanagari text-xs text-[#C8201A] font-semibold mb-1">{cell.hindi}</p>
            <h2 className="font-bold text-[#0D2660]">{cell.name}</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{cell.summary}</p>
          </Link>
        ))}
      </div>
    </MarketingPage>
  );
}
