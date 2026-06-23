"use client";

import Link from "next/link";
import { FontSizeControl } from "@/components/layout/FontSizeControl";
import { UTILITY_BAR_LINKS } from "@/lib/content/design-portal";

/** Utility links + accessibility controls — lives in footer, not header */
export function FooterUtilityBar() {
  return (
    <div className="border-t border-blue-900 py-4 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm"
          aria-label="Utility links"
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
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <Link href="/" className="text-gray-400 hover:text-[#F5C200] font-devanagari transition-colors">
            हिन्दी
          </Link>
          <span className="text-blue-800 hidden sm:inline" aria-hidden="true">|</span>
          <FontSizeControl />
          <a
            href="mailto:rkm.narainpur@gmail.com"
            className="text-gray-400 hover:text-[#F5C200] transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
