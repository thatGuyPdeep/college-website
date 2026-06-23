import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { STATUTORY_CELLS } from "@/lib/content/reference-portal";

export const metadata: Metadata = {
  title: "Right to Information (RTI)",
  description: "RTI Act 2005 — public information officer and application procedure.",
};

export default function RtiPage() {
  const rti = STATUTORY_CELLS.find((c) => c.slug === "rti");

  return (
    <MarketingPage
      title="Right to Information (RTI)"
      hindiTitle="सूचना का अधिकार"
      description="Request public information under the RTI Act, 2005."
      breadcrumbs={[{ label: "Statutory Cells", href: "/cells" }]}
    >
      <div className="max-w-3xl space-y-6 prose prose-sm text-gray-600">
        <p>{rti?.summary}</p>
        <h2 className="text-lg font-bold text-[#0D2660] not-prose">How to apply</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Submit a written application to the Public Information Officer (PIO) at the college office.</li>
          <li>Include your name, address, and specific information sought.</li>
          <li>Pay the prescribed application fee as per RTI rules.</li>
          <li>The PIO will respond within the statutory time limit (typically 30 days).</li>
        </ol>
        <div className="not-prose rounded-xl border border-blue-100 bg-[#F0F4FF] p-6">
          <p className="font-bold text-[#0D2660]">Public Information Officer</p>
          <p className="text-sm mt-2">Ramakrishna Mission College, Narayanpur</p>
          <p className="text-sm">
            <a href="mailto:rkm.narainpur@gmail.com" className="text-[#C8201A] hover:underline">
              rkm.narainpur@gmail.com
            </a>
          </p>
        </div>
        <p className="not-prose">
          <Link href="/cells/rti" className="text-[#0D2660] font-semibold hover:underline">
            RTI Cell page →
          </Link>
        </p>
      </div>
    </MarketingPage>
  );
}
