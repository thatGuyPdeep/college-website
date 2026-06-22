import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Hostel" };

export default function HostelPage() {
  return (
    <>
      <PageHero eyebrow="Campus Life" title="Hostel" description="Residential facilities for students at Ramakrishna Mission Ashrama, Narayanpur." />
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / <Link href="/campus/infrastructure">Campus</Link> / Hostel
          </nav>
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                The Ramakrishna Mission Ashrama provides free residential schooling and hostel facilities
                for tribal students from the Abujhmaria community through Vivekananda Vidyapeeth and
                associated residential programmes.
              </p>
              <p>
                Hostel rules emphasise discipline, study hours, and spiritual values in line with the
                Mission&apos;s man-making education philosophy. For hostel admission queries, contact the
                Ashrama office at <a href="tel:+917781252251" className="text-[#C8201A]">07781-252251</a> or
                visit the <Link href="/contact" className="text-[#C8201A]">contact page</Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
