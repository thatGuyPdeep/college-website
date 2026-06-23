import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { LIBRARY_E_RESOURCES } from "@/lib/content/reference-portal";

export const metadata: Metadata = {
  title: "Library E-Resources",
  description: "Online journals, open resources, and digital library portals.",
};

export default function LibraryEResourcesPage() {
  return (
    <MarketingPage
      title="Surfing Zone — E-Resources"
      hindiTitle="ई-संसाधन"
      description="Digital library portals, open courseware, and online reading materials."
      breadcrumbs={[
        { label: "Library", href: "/campus/library" },
      ]}
    >
      <div className="space-y-10">
        {LIBRARY_E_RESOURCES.map((group) => (
          <section key={group.category}>
            <h2 className="text-lg font-bold text-[#0D2660] mb-4">{group.category}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-between gap-2 p-4 rounded-xl border border-blue-100 bg-white hover:bg-[#F0F4FF] text-sm font-medium text-[#0D2660] transition-colors group"
                >
                  {link.label}
                  {link.external && (
                    <ExternalLink className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 shrink-0" />
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm">
        <Link href="/campus/library" className="text-[#0D2660] font-semibold hover:underline">
          ← Central Library
        </Link>
      </p>
    </MarketingPage>
  );
}
