import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { EXAMINATION_HELPLINE } from "@/lib/content/reference-portal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Examination Helpline",
  description: "Examination control room contact, hours, and support information.",
};

export default function ExaminationHelplinePage() {
  const h = EXAMINATION_HELPLINE;

  return (
    <MarketingPage
      title={h.title}
      hindiTitle="परीक्षा सहायता"
      description="Contact the examination section for enrollment, admit cards, results, and grievances."
      breadcrumbs={[
        { label: "Examination", href: "/examination" },
      ]}
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="flex items-start gap-3 p-5 rounded-2xl border border-blue-100 bg-white">
          <Clock className="h-5 w-5 text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#0D2660]">Office Hours</p>
            <p className="text-sm text-gray-600 mt-1">{h.hours}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-5 rounded-2xl border border-blue-100 bg-white">
          <Phone className="h-5 w-5 text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#0D2660]">Phone</p>
            <a href={`tel:${h.phone.replace(/\s/g, "")}`} className="text-sm text-[#C8201A] font-medium mt-1 block hover:underline">
              {h.phone}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3 p-5 rounded-2xl border border-blue-100 bg-white">
          <Mail className="h-5 w-5 text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#0D2660]">Email</p>
            <a href={`mailto:${h.email}`} className="text-sm text-[#C8201A] font-medium mt-1 block hover:underline">
              {h.email}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3 p-5 rounded-2xl border border-blue-100 bg-white">
          <MapPin className="h-5 w-5 text-[#0D2660] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#0D2660]">Address</p>
            <p className="text-sm text-gray-600 mt-1">{h.address}</p>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-[#0D2660] mb-4">Important Notes</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
          {h.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-[#0D2660] hover:bg-[#071540]">
          <Link href="/contact?subject=Examination%20Query">Send a Query</Link>
        </Button>
        <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660]">
          <Link href="/examination">Back to Examination Portal</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}
