import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GOVERNMENT_PORTALS } from "@/lib/content/reference-portal";
import { SectionHeader } from "@/components/layout/SectionHeader";

export function ImportantLinksGrid() {
  return (
    <section className="section bg-white" aria-labelledby="gov-links-heading">
      <div className="container-site">
        <SectionHeader
          align="center"
          eyebrow="Useful Resources"
          title="Important Websites"
          description="Government portals, e-learning platforms, and affiliated institutions"
          className="mb-8"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GOVERNMENT_PORTALS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 p-3 rounded-xl border border-blue-100 bg-[#F0F4FF] hover:border-[#0D2660]/30 hover:bg-white text-sm font-medium text-[#0D2660] transition-colors group"
            >
              <span className="leading-snug">{link.label}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-40 group-hover:opacity-100" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="text-center mt-6 text-sm text-gray-500">
          Affiliated to{" "}
          <Link href="https://smkvbastar.ac.in" target="_blank" rel="noopener noreferrer" className="text-[#0D2660] font-semibold hover:underline">
            Shaheed Mahendra Karma Vishwavidyalaya, Bastar
          </Link>
        </p>
      </div>
    </section>
  );
}
