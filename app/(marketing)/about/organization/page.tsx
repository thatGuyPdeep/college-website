import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import {
  ORGANIZATION_INTRO,
  ORG_TOP_LEVEL,
  ORG_ACADEMIC_UNITS,
  ORG_WELFARE_CELLS,
} from "@/lib/content/organization";

export const metadata: Metadata = {
  title: "Organizational Structure",
  description: "Hierarchy and academic units at Ramakrishna Mission Vivekananda College, Narayanpur.",
};

function RoleCard({ role }: { role: (typeof ORG_TOP_LEVEL)[0] }) {
  const inner = (
    <>
      {role.hindi && (
        <p className="devanagari text-xs text-[#C8201A] font-semibold mb-1">{role.hindi}</p>
      )}
      <h3 className="font-bold text-[#0D2660]">{role.title}</h3>
      {role.holder && <p className="text-sm font-medium text-gray-800 mt-1">{role.holder}</p>}
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{role.description}</p>
    </>
  );

  if (role.href?.startsWith("http")) {
    return (
      <a
        href={role.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border border-blue-100 bg-white p-5 hover:bg-[#F0F4FF] card-lift"
      >
        {inner}
        <ExternalLink className="h-4 w-4 text-gray-400 mt-2" aria-hidden="true" />
      </a>
    );
  }

  if (role.href) {
    return (
      <Link href={role.href} className="block rounded-2xl border border-blue-100 bg-white p-5 hover:bg-[#F0F4FF] card-lift">
        {inner}
      </Link>
    );
  }

  return <div className="rounded-2xl border border-blue-100 bg-white p-5">{inner}</div>;
}

export default function OrganizationPage() {
  return (
    <MarketingPage
      title="Organizational Structure"
      hindiTitle="संगठन संरचना"
      description={ORGANIZATION_INTRO}
      breadcrumbs={[
        { label: "About", href: "/about" },
        { label: "Governance", href: "/about/governance" },
      ]}
    >
      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Leadership & Affiliation</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {ORG_TOP_LEVEL.map((role) => (
            <RoleCard key={role.title} role={role} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Academic Units & Cells</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ORG_ACADEMIC_UNITS.map((unit) => (
            <Link
              key={unit.title}
              href={unit.href ?? "#"}
              className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm"
            >
              <span className="font-semibold text-[#0D2660] block">{unit.title}</span>
              <span className="text-gray-600">{unit.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Student Welfare & Compliance</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ORG_WELFARE_CELLS.map((cell) => (
            <Link
              key={cell.title}
              href={cell.href ?? "#"}
              className="p-4 rounded-xl border border-blue-100 hover:bg-blue-50 text-sm"
            >
              <span className="font-semibold text-[#0D2660] block">{cell.title}</span>
              <span className="text-gray-600">{cell.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </MarketingPage>
  );
}
