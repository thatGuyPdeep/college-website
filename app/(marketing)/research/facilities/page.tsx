import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Research Facilities" };

const FACILITIES = [
  { label: "Computer Lab & ICT", href: "/campus/infrastructure", desc: "Programming, DBMS, and project workstations" },
  { label: "Library", href: "/campus/library", desc: "Textbooks, journals, and reading room" },
  { label: "E-Resources", href: "/campus/library/e-resources", desc: "INFLIBNET and digital access" },
  { label: "Sports Infrastructure", href: "/campus/sports", desc: "Indoor stadium and training grounds" },
  { label: "Publications", href: "/campus/library/publications", desc: "Mission and college publications" },
];

export default function ResearchFacilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Facilities & Labs"
        description="Infrastructure supporting teaching, research projects, and sports science."
      />
      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/research">Research</Link> / Facilities
          </nav>
          <ul className="space-y-4">
            {FACILITIES.map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  className="block p-5 rounded-xl border border-blue-100 hover:border-[#0D2660]/30 bg-[#F0F4FF]/40"
                >
                  <span className="font-semibold text-[#0D2660]">{f.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
