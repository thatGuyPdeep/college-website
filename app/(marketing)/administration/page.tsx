import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { HubPageGrid } from "@/components/marketing/HubPageGrid";
import { ADMINISTRATION_HUB_LINKS } from "@/lib/content/portal-hubs";

export const metadata: Metadata = { title: "Administration & Leadership" };

export default function AdministrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Administration & Leadership"
        description="Governance, leadership, quality assurance, and statutory compliance — IIT-style institutional transparency."
      />
      <section className="section bg-white">
        <div className="container-site max-w-5xl">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/">Home</Link> / Administration
          </nav>
          <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">
            Ramakrishna Mission Vivekananda College is administered under the Secretary of Ramakrishna
            Mission Ashrama, Narainpur, with academic leadership, IQAC, and statutory cells ensuring
            NEP 2020 compliance and UGC disclosure norms.
          </p>
          <HubPageGrid items={ADMINISTRATION_HUB_LINKS} />
        </div>
      </section>
    </>
  );
}
