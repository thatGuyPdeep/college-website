"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthNav } from "@/components/layout/AuthNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS, RKM_LOGO_URL, SITE_FULL_NAME, SITE_LOCATION, RKM_FACTS } from "@/lib/utils/constants";

function MegaMenuPanel({ children }: { children: { label: string; href: string }[] }) {
  return (
    <div className="absolute top-full left-0 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
      <div className="rounded-b-lg border border-t-0 border-blue-100 bg-white shadow-lg overflow-hidden min-w-[13rem]">
        {children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0D2660] border-b border-blue-50 last:border-b-0 transition-colors"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * IIT Delhi–inspired header: compact branding + single nav row.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Branding — compact */}
      <div className="border-b border-gray-200">
        <div className="container-site py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
              aria-label="Ramakrishna Mission College, Narayanpur — Home"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
                <Image
                  src={RKM_LOGO_URL}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="44px"
                  priority
                />
              </div>
              <div className="leading-tight min-w-0">
                <div className="devanagari hidden sm:block font-semibold text-[11px] text-[#0D2660] leading-tight truncate">
                  रामकृष्ण मिशन कॉलेज, नारायणपुर
                </div>
                <div className="font-bold text-sm sm:text-[15px] text-[#0D2660] leading-tight">
                  {SITE_FULL_NAME}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-500 truncate">
                  {SITE_LOCATION} · {RKM_FACTS.university}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/search"
                className="hidden sm:flex p-2 text-gray-500 hover:text-[#0D2660] rounded-md hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Link>
              <div className="hidden md:block">
                <AuthNav />
              </div>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex h-8 bg-[#C8201A] hover:bg-[#9B1812] text-white text-xs font-semibold px-3"
              >
                <Link href="/admissions/apply">Apply Now</Link>
              </Button>
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-[#0D2660] hover:bg-gray-100"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Single main navigation row — IITD mega-menu */}
        <div className="bg-[#0D2660] hidden lg:block">
          <div className="container-site">
            <nav className="flex items-center flex-nowrap gap-0 h-10" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="relative group h-full flex items-stretch">
                  <Link
                    href={link.href}
                    className="flex items-center gap-0.5 px-2.5 xl:px-3 h-full text-[11px] xl:text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    {link.label}
                    {"children" in link && link.children && (
                      <ChevronDown className="h-3 w-3 opacity-70 shrink-0" aria-hidden="true" />
                    )}
                  </Link>
                  {"children" in link && link.children && (
                    <MegaMenuPanel children={[...link.children]} />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
