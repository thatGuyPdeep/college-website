import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Shield } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT, SITE_URL } from "@/lib/utils/constants";
import { ARATI_TIMINGS } from "@/lib/content/site-info";

const base = SITE_URL.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: {
    types: {
      "application/rss+xml": `${base}/news/feed`,
    },
  },
};

const CONTACT_ITEMS = [
  { icon: MapPin, title: "Address", lines: [CONTACT.org, CONTACT.address] },
  { icon: Phone, title: "Phone", lines: [...CONTACT.phones, `ITI: ${CONTACT.iti_phone}`] },
  { icon: Mail, title: "Email", lines: [CONTACT.email, `ITI: ${CONTACT.iti_email}`] },
  { icon: Clock, title: "Office Hours", lines: CONTACT.office_hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        description="We're here to help with admissions, academic enquiries, and general information about the Ashrama and college."
      />

      <section className="section bg-white">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6 sm:mb-8">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/" className="hover:text-[#0D2660]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Contact</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div className="order-2 lg:order-1">
              <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-10">
                {CONTACT_ITEMS.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="p-2.5 rounded-lg bg-blue-50 h-fit shrink-0">
                      <item.icon className="h-5 w-5 text-[#0D2660]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                      {item.lines.map((l) => (
                        <div key={l} className="text-sm text-gray-600 break-words">{l}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F0F4FF] rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-[#0D2660] mb-2 text-sm">Hospital Hours</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {CONTACT.hospital_hours.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </div>
                <div className="bg-[#F0F4FF] rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-[#0D2660] mb-2 text-sm">Temple Hours</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {CONTACT.temple_hours.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-[#F0F4FF] rounded-xl p-5 border border-blue-100 mb-8">
                <h3 className="font-bold text-[#0D2660] mb-3 text-sm">Arati Timings</h3>
                <div className="table-responsive border-0 shadow-none">
                  <table className="w-full text-sm">
                    <tbody>
                      {ARATI_TIMINGS.map((row) => (
                        <tr key={row.period} className="border-b border-blue-100 last:border-0">
                          <td className="py-2 text-gray-600 pr-3">{row.period}</td>
                          <td className="py-2 text-[#0D2660] font-semibold whitespace-nowrap">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <iframe
                title="Map — Ramakrishna Mission Ashrama Narayanpur"
                className="w-full h-56 sm:h-64 rounded-xl border border-blue-100"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.map_query)}&output=embed`}
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-[#F0F4FF] rounded-2xl p-6 sm:p-8 border border-blue-100">
                <h2 className="text-xl font-bold text-[#0D2660] mb-2">Send a Message</h2>
                <p className="text-sm text-gray-500 mb-6">For admissions and general enquiries. We typically respond within 2–3 working days.</p>
                <ContactForm />
              </div>
            </div>
          </div>

          <section id="grievance" className="scroll-mt-24 mt-16 pt-12 border-t border-blue-100">
            <div className="flex items-start gap-3 mb-6">
              <Shield className="h-6 w-6 text-[#C8201A] shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-[#0D2660]">Grievance Redressal &amp; Anti-Ragging</h2>
                <p className="text-sm text-gray-500 mt-1">UGC-mandated contact points for student welfare</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[#F0F4FF] rounded-xl p-5 border border-blue-100">
                <h3 className="font-semibold text-[#0D2660] mb-2">Grievance Redressal Cell</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Students, parents, or staff may lodge grievances regarding academics, hostel, discrimination,
                  or administrative matters. Submit via the form above with subject &ldquo;Grievance&rdquo; or email directly.
                </p>
                <p className="text-sm">
                  <a href={`mailto:${CONTACT.email}`} className="text-[#0D2660] font-medium hover:underline">{CONTACT.email}</a>
                  {" · "}
                  {CONTACT.phones[0]}
                </p>
              </div>
              <div className="bg-[#F0F4FF] rounded-xl p-5 border border-blue-100">
                <h3 className="font-semibold text-[#0D2660] mb-2">Anti-Ragging Cell</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Ramakrishna Mission College maintains a zero-tolerance policy on ragging as per UGC regulations.
                  Report incidents confidentially to the Anti-Ragging Nodal Officer.
                </p>
                <p className="text-sm text-gray-600">
                  Helpline: <strong className="text-[#0D2660]">{CONTACT.phones[0]}</strong>
                  <br />
                  Email: <a href={`mailto:${CONTACT.email}`} className="text-[#0D2660] font-medium hover:underline">{CONTACT.email}</a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
