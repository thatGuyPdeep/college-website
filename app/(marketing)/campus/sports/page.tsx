import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { SPORTS } from "@/lib/content/education";

export const metadata: Metadata = {
  title: "Sports",
  description: "Sports training and annual meet at Ramakrishna Mission Ashrama, Narayanpur.",
};

export default function SportsPage() {
  return (
    <MarketingPage
      title="Sports & Physical Education"
      hindiTitle="खेल"
      description={SPORTS.intro}
      breadcrumbs={[{ label: "Infrastructure", href: "/campus/infrastructure" }]}
    >
      <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-blue-100 mb-8">
        <Image
          src="/images/act-sports.jpg"
          alt="Sports activities at Ramakrishna Mission Narayanpur"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">{SPORTS.nationalNote}</p>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Disciplines</h2>
        <p className="text-sm text-gray-600 mb-4">
          Kho-Kho, Volleyball, Gymnastics, Athletics, Football, Mallakhamb, Badminton, Basketball, Table Tennis, Yoga, and more.
        </p>
        <Link href="/about/activities#sports" className="text-sm font-semibold text-[#C8201A] hover:underline">
          Ashrama sports programmes →
        </Link>
      </section>

      <section>
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">State & National Participation</h2>
        <div className="overflow-x-auto rounded-2xl border border-blue-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0D2660] text-white text-left">
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">State Level</th>
                <th className="px-4 py-3 font-semibold">National Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {SPORTS.participation.map((row) => (
                <tr key={row.year} className="hover:bg-blue-50/50">
                  <td className="px-4 py-3 font-medium text-[#0D2660]">{row.year}</td>
                  <td className="px-4 py-3 text-gray-700">{row.state.total} students</td>
                  <td className="px-4 py-3 text-gray-700">{row.national.total} students</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Rajya Khel Alankaran Puraskar (2018) — Government of Chhattisgarh, for sports training in tribal areas.
        </p>
      </section>
    </MarketingPage>
  );
}
