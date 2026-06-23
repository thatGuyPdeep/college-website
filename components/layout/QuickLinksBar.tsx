import Link from "next/link";
import { QUICK_LINKS } from "@/lib/content/reference-portal";

export function QuickLinksBar() {
  return (
    <div className="hidden lg:block bg-[#071540] border-b border-blue-900/50">
      <div className="container-site py-1 flex items-center gap-1 overflow-x-auto text-[10px]">
        <span className="text-[#F5C200] font-semibold uppercase tracking-wider shrink-0 pr-2">
          Quick Links
        </span>
        {QUICK_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center shrink-0">
            {i > 0 && <span className="text-blue-700 mx-1" aria-hidden="true">|</span>}
            <Link
              href={link.href}
              className="text-blue-200 hover:text-[#F5C200] whitespace-nowrap transition-colors py-0.5"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
