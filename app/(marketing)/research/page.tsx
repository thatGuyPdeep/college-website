import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { HubPageGrid } from "@/components/marketing/HubPageGrid";
import { RESEARCH_HUB_LINKS } from "@/lib/content/portal-hubs";

export const metadata: Metadata = {
  title: "Research",
  description: "Research, extension activities, and facilities at Ramakrishna Mission Vivekananda College, Narayanpur.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Research & Extension"
        description="Mission-aligned research, tribal development outreach, and academic facilities supporting NEP 2020 programmes."
      />
      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / Research
          </nav>
          <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">
            The college promotes applied research in computer science, commerce, economics, and sports
            education while serving the Abujhmarh region through extension and community engagement —
            in the spirit of the Ramakrishna Mission&apos;s service ideal.
          </p>
          <HubPageGrid items={RESEARCH_HUB_LINKS} />
        </div>
      </section>
    </>
  );
}
