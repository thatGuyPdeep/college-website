import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Wifi, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicPublications } from "@/lib/content/site-content";
import { EXTERNAL_LINKS } from "@/lib/utils/constants";

export const metadata: Metadata = { title: "Library" };

export default async function LibraryPage() {
  const pubs = await getPublicPublications();

  return (
    <>
      <PageHero eyebrow="Campus Life" title="Library" description="Central library resources for students and faculty at Ramakrishna Mission Vivekananda College, Narayanpur." />
      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <ol className="flex gap-2">
              <li><Link href="/">Home</Link></li><li>/</li>
              <li><Link href="/campus/infrastructure">Campus</Link></li><li>/</li>
              <li aria-current="page">Library</li>
            </ol>
          </nav>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: BookOpen, title: "Collection", desc: "Textbooks, reference works, journals, and NEP-aligned study materials for all UG programmes." },
              { icon: Clock, title: "Timings", desc: "Mon–Sat: 9:00 AM – 5:00 PM. Extended hours during exam periods." },
              { icon: Wifi, title: "E-Resources", desc: "Access to INFLIBNET/N-LIST e-journals and digital learning resources (on-campus)." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <item.icon className="h-6 w-6 text-[#0D2660] mb-3" aria-hidden="true" />
                  <h2 className="font-semibold text-gray-900 mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/campus/library/e-resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D2660] hover:text-[#C8201A]"
            >
              Surfing Zone — All E-Resources <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <p className="text-gray-600 text-sm mb-12">
            The library supports the Four-Year Undergraduate Programme (FYUGP) under NEP 2020, with dedicated sections for Commerce, Computer Science, and Physics. For library membership queries, contact the college office.
          </p>

          <section aria-labelledby="online-reading-heading" className="border border-blue-100 rounded-2xl p-6 sm:p-8 bg-[#F0F4FF]/50">
            <h2 id="online-reading-heading" className="text-xl font-bold text-[#0D2660] mb-2">
              Online Reading — Ramakrishna Math & Mission Publications
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {pubs.hub.tagline} Browse free e-books, scriptural texts, biographies, and magazines in English and Indian languages.
            </p>

            <a
              href={pubs.hub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0D2660] text-white font-semibold rounded-md px-5 py-2.5 mb-8 hover:bg-[#071540] transition-colors"
            >
              Visit publications.rkmm.org <ExternalLink className="h-4 w-4" />
            </a>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">English sections</h3>
            <ul className="grid sm:grid-cols-2 gap-2 mb-8">
              {pubs.english.map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-white hover:bg-blue-50 hover:border-blue-300 text-sm text-gray-700 transition-colors"
                  >
                    {item.label}
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Indian languages</h3>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
              {pubs.indianLanguages.map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border bg-white hover:bg-blue-50 text-sm text-gray-700 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Popular essential books</h3>
            <ul className="flex flex-wrap gap-2 mb-4">
              {pubs.highlights.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white border border-blue-100 rounded-full px-3 py-1 text-gray-700 hover:bg-blue-50"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500">
              Also available via the college footer:{" "}
              <a href={EXTERNAL_LINKS.onlineReading} className="text-[#0D2660] underline" target="_blank" rel="noopener noreferrer">
                Online Reading
              </a>
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
