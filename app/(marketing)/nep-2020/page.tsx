import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { NEP_2020_POINTS } from "@/lib/content/reference-portal";

export const metadata: Metadata = {
  title: "NEP 2020",
  description: "National Education Policy 2020 implementation at Ramakrishna Mission Vivekananda College.",
};

export default function Nep2020Page() {
  return (
    <MarketingPage
      title="NEP 2020"
      hindiTitle="राष्ट्रीय शिक्षा नीति 2020"
      description="How the National Education Policy 2020 is implemented through FYUGP, ABC, and vocational integration."
      breadcrumbs={[{ label: "Academics", href: "/academics" }]}
    >
      <div className="space-y-6 max-w-3xl">
        {NEP_2020_POINTS.map((point) => (
          <article key={point.title} className="rounded-2xl border border-blue-100 bg-white p-6 card-lift">
            <h2 className="font-bold text-[#0D2660] text-lg">{point.title}</h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">{point.body}</p>
          </article>
        ))}
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Explore programmes:{" "}
        <Link href="/academics" className="text-[#0D2660] font-semibold hover:underline">
          Academics →
        </Link>
        {" · "}
        <Link href="/admissions" className="text-[#0D2660] font-semibold hover:underline">
          Admissions →
        </Link>
      </p>
    </MarketingPage>
  );
}
