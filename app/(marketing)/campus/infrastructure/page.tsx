import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { COLLEGE_INFRASTRUCTURE, INFRASTRUCTURE_INTRO } from "@/lib/content/campus-facilities";

export const metadata: Metadata = {
  title: "Infrastructure",
  description: "Campus facilities at Ramakrishna Mission Vivekananda College, Narayanpur — labs, library, ITI workshops, hostel, and auditorium.",
};

export default function InfrastructurePage() {
  return (
    <MarketingPage
      title="Infrastructure & Facilities"
      hindiTitle="अवसंरचना"
      description={INFRASTRUCTURE_INTRO}
      breadcrumbs={[{ label: "Campus", href: "/campus/infrastructure" }]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLLEGE_INFRASTRUCTURE.map((f) => (
          <article
            key={f.name}
            className="rounded-2xl border border-blue-100 bg-white p-5 card-lift hover:border-[#0D2660]/20 transition-colors"
          >
            {f.hindi && (
              <p className="devanagari text-xs text-[#C8201A] font-semibold mb-1">{f.hindi}</p>
            )}
            <h2 className="font-bold text-[#0D2660] mb-2">{f.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{f.description}</p>
            {f.href && (
              <Link href={f.href} className="text-sm font-semibold text-[#C8201A] hover:underline">
                Learn more →
              </Link>
            )}
          </article>
        ))}
      </div>
    </MarketingPage>
  );
}
