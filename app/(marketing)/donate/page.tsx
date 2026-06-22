import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { CONTACT, EXTERNAL_LINKS } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Ramakrishna Mission Ashrama Narayanpur — education, healthcare and tribal welfare in Abujhmarh. Donations eligible for 80G tax deduction.",
};

const DONATION_RAZORPAY = EXTERNAL_LINKS.donateOnline;

const ONLINE_RULES = [
  "Minimum online donation: ₹500 · Maximum per transaction: ₹5 lakh",
  "For Indian citizens and Indian organizations only (not for foreign nationals)",
  "PAN mandatory above ₹10,000; Aadhaar or PAN below ₹10,000",
  "All contributions eligible for deduction under Section 80G of the Income Tax Act",
  "Cheques/Demand Drafts payable to \"Ramakrishna Mission Ashrama, Narainpur\"",
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support the Mission"
        title="Donate"
        description="Help us serve the Abujhmaria tribal community through education, healthcare, and rural development across 200+ villages in Abujhmarh."
      />

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Ramakrishna Mission Ashrama, Narayanpur — a branch centre of Ramakrishna Math &amp; Ramakrishna Mission,
              Belur Math — has been rendering welfare services since 1985 for the Hill Marias, one of India&apos;s most
              primitive tribal groups in Abujhmarh, Chhattisgarh. While government grants support much of our work,
              the scale of service demands generous contributions from well-wishers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Your donation helps run schools, hospitals, interior service centres, and livelihood programmes.
              Each rupee is spent for the intended purpose. We especially appeal to those without legal heirs to
              consider gifting assets for the welfare of the children of Abujhmarh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button asChild size="lg" className="bg-[#C8201A] hover:bg-[#9B1812] text-white gap-2">
              <a href={DONATION_RAZORPAY} target="_blank" rel="noopener noreferrer">
                <Heart className="h-5 w-5" /> Donate Online (Razorpay)
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#0D2660] text-[#0D2660]">
              <Link href="/about/activities">View Our Activities</Link>
            </Button>
          </div>

          <h2 className="text-lg font-bold text-[#0D2660] mb-4">Online donation guidelines</h2>
          <ul className="space-y-2 mb-10">
            {ONLINE_RULES.map((rule) => (
              <li key={rule} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                <span className="text-[#C8201A]" aria-hidden="true">•</span>
                {rule}
              </li>
            ))}
          </ul>

          <div className="bg-[#F0F4FF] rounded-xl p-6 border border-blue-100 text-sm text-gray-700">
            <p className="font-semibold text-[#0D2660] mb-2">Contact for donations</p>
            <p>{CONTACT.org}</p>
            <p>{CONTACT.address}</p>
            <p className="mt-2">
              <a href={`mailto:${CONTACT.email}`} className="text-[#0D2660] hover:underline">{CONTACT.email}</a>
              {" · "}
              {CONTACT.phones[0]}
            </p>
            <p className="mt-4 italic text-gray-500">
              With deep regards, <strong>Swami Vyaptananda</strong>, Secretary
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Also visit the Mission website at{" "}
            <a href={EXTERNAL_LINKS.missionSite} className="underline" target="_blank" rel="noopener noreferrer">
              narainpur.rkmm.org
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
