import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ITI_TRADES_ENGINEERING,
  ITI_TRADES_NON_ENGINEERING,
  ITI_CONTACT,
  ITI_ABOUT_EN,
  ITI_ADMISSION_PRIORITY,
  ITI_FACILITIES,
} from "@/lib/content/iti";

export const metadata: Metadata = {
  title: "Industrial Training Institute (ITI)",
  description: "Ramakrishna Mission ITI, Narayanpur — NCVT-affiliated vocational trades for tribal youth.",
};

export default function ItiPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
          <li>/</li>
          <li><Link href="/academics" className="hover:text-[#0D2660]">Academics</Link></li>
          <li>/</li>
          <li aria-current="page">ITI</li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2660]">Ramakrishna Mission ITI, Narayanpur</h1>
          <p className="text-gray-600 mt-2">NCVT-affiliated Industrial Training Institute for tribal youth</p>
        </div>
        <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] shrink-0 gap-2">
          <a href={ITI_CONTACT.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" /> Official ITI website
          </a>
        </Button>
      </div>

      <p className="text-gray-700 leading-relaxed mb-10">{ITI_ABOUT_EN}</p>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Engineering trades (NCVT)</h2>
        <div className="overflow-x-auto border border-blue-100 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="navy-gradient text-white">
                <th className="text-left px-4 py-3">Trade</th>
                <th className="text-left px-4 py-3">Duration</th>
                <th className="text-left px-4 py-3">Seats</th>
                <th className="text-left px-4 py-3">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 bg-white">
              {ITI_TRADES_ENGINEERING.map((t) => (
                <tr key={t.trade}>
                  <td className="px-4 py-3 font-medium">{t.trade}</td>
                  <td className="px-4 py-3">{t.duration}</td>
                  <td className="px-4 py-3">{t.seats}</td>
                  <td className="px-4 py-3 text-gray-600">{t.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Non-engineering trades</h2>
        <div className="overflow-x-auto border border-blue-100 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="navy-gradient text-white">
                <th className="text-left px-4 py-3">Trade</th>
                <th className="text-left px-4 py-3">Duration</th>
                <th className="text-left px-4 py-3">Seats</th>
                <th className="text-left px-4 py-3">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 bg-white">
              {ITI_TRADES_NON_ENGINEERING.map((t) => (
                <tr key={t.trade}>
                  <td className="px-4 py-3 font-medium">{t.trade}</td>
                  <td className="px-4 py-3">{t.duration}</td>
                  <td className="px-4 py-3">{t.seats}</td>
                  <td className="px-4 py-3 text-gray-600">{t.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admission priority</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          {ITI_ADMISSION_PRIORITY.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Campus facilities</h2>
        <dl className="grid sm:grid-cols-2 gap-3">
          {ITI_FACILITIES.map((f) => (
            <div key={f.label} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <dt className="text-xs text-gray-500">{f.label}</dt>
              <dd className="font-semibold text-[#0D2660]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white border border-blue-100 rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Contact ITI</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#C8201A]" />{ITI_CONTACT.address}</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-[#C8201A]" />{ITI_CONTACT.phone}</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-[#C8201A]" />{ITI_CONTACT.email}</li>
          <li className="text-gray-500">{ITI_CONTACT.hours}</li>
        </ul>
      </section>
    </div>
  );
}
