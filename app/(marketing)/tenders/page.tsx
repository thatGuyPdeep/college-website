import type { Metadata } from "next";
import { MarketingPage } from "@/components/layout/MarketingPage";

export const metadata: Metadata = {
  title: "Tenders & Quotations",
  description: "Procurement tenders and quotations invited by the college.",
};

export default function TendersPage() {
  return (
    <MarketingPage
      title="Tenders / Quotations"
      hindiTitle="निविदा / कोटेशन"
      description="Active and archived tenders for goods, services, and civil works."
      breadcrumbs={[]}
    >
      <div className="rounded-2xl border border-blue-100 bg-[#F0F4FF] p-8 text-center">
        <p className="text-gray-600 text-sm max-w-xl mx-auto">
          No active tenders at this time. Procurement notices are also published under{" "}
          <a href="/news?category=Notice" className="text-[#0D2660] font-semibold hover:underline">
            News &amp; Notices
          </a>
          .
        </p>
      </div>
    </MarketingPage>
  );
}
