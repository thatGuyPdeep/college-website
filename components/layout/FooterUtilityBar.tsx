"use client";

import Link from "next/link";
import { UTILITY_BAR_LINKS } from "@/lib/content/design-portal";

/** Secondary utility links in footer — primary links live in header UtilityTopBar */
export function FooterUtilityBar() {
  return (
    <div className="border-t border-blue-900 py-2 mt-3">
      <nav
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] sm:text-xs"
        aria-label="Footer utility links"
      >
        {UTILITY_BAR_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center">
            {i > 0 && <span className="text-blue-800 mr-3 hidden sm:inline" aria-hidden="true">|</span>}
            <Link href={link.href} className="text-gray-400 hover:text-[#F5C200] transition-colors">
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
