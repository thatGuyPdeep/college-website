import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { HubPageGrid } from "@/components/marketing/HubPageGrid";
import { PEOPLE_HUB_SECTIONS } from "@/lib/content/portal-hubs";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  return (
    <>
      <PageHero
        eyebrow="People"
        title="Our Community"
        description="Faculty, staff, students, and institutional authorities — the people who make RKM Vivekananda College."
      />
      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / People
          </nav>
          <HubPageGrid
            items={PEOPLE_HUB_SECTIONS.map((s) => ({
              label: s.label,
              href: s.href,
              description: s.description,
            }))}
          />
          <div className="mt-10 p-6 rounded-xl bg-[#F0F4FF] border border-blue-100">
            <h2 className="font-semibold text-[#0D2660] mb-2">ERP Portals</h2>
            <p className="text-sm text-gray-600 mb-4">
              Students and faculty can sign in for attendance, marks, salary slips, and leave applications.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login?redirect=/student" className="text-sm font-semibold text-[#C8201A] hover:underline">
                Student ERP →
              </Link>
              <Link href="/login?redirect=/faculty-portal" className="text-sm font-semibold text-[#C8201A] hover:underline">
                Faculty ERP →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
