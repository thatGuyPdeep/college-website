import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { ALUMNI_PORTAL } from "@/lib/content/reference-portal";
import { AlumniRegistrationForm } from "@/components/alumni/AlumniRegistrationForm";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Ramakrishna Mission Vivekananda College alumni network — register, reconnect, and support the Mission.",
};

export default function AlumniPage() {
  return (
    <MarketingPage
      title="Alumni Portal"
      hindiTitle="पूर्व छात्र"
      description="Stay connected with Ramakrishna Mission Vivekananda College, Narayanpur."
      breadcrumbs={[]}
    >
      <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">{ALUMNI_PORTAL.about}</p>
      <p className="text-sm text-gray-500 mb-8 max-w-3xl">{ALUMNI_PORTAL.registrationNote}</p>

      <section id="register" className="mb-10 rounded-2xl border border-blue-100 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[#0D2660] mb-2">Register / Update Your Details</h2>
        <p className="text-sm text-gray-600 mb-6 max-w-xl">
          Submit your batch, programme, and contact information. The alumni cell will reach out for reunions, mentorship, and college updates.
        </p>
        <AlumniRegistrationForm />
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {ALUMNI_PORTAL.links.filter((l) => !l.label.includes("Register")).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-5 rounded-2xl border border-blue-100 bg-white hover:bg-[#F0F4FF] hover:border-[#0D2660]/30 card-lift transition-colors"
          >
            <span className="font-semibold text-[#0D2660]">{link.label} →</span>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl navy-gradient text-white p-8">
        <h2 className="text-xl font-bold mb-2">Give Back to the Mission</h2>
        <p className="text-blue-100 text-sm mb-4 max-w-2xl">
          Alumni contributions support scholarships, library resources, and tribal outreach in Abujhmarh.
        </p>
        <Button asChild className="bg-[#F5C200] text-[#0D2660] hover:bg-[#D4A800]">
          <Link href="/donate">Donate</Link>
        </Button>
      </section>
    </MarketingPage>
  );
}
