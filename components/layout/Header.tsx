"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthNav } from "@/components/layout/AuthNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS, RKM_LOGO_URL, SITE_FULL_NAME, SITE_LOCATION } from "@/lib/utils/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md supports-[backdrop-filter]:backdrop-blur-md">
      {/* Top utility bar — compact */}
      <div className="bg-[#0D2660] text-white text-[10px] leading-none">
        <div className="container-site py-0.5 sm:py-1 flex items-center justify-between gap-2 min-h-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <a
              href="tel:+917781252251"
              className="flex items-center gap-1 hover:text-[#F5C200] transition-colors shrink-0"
              aria-label="Call 07781-252251"
            >
              <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">07781-252251</span>
            </a>
            <a
              href="mailto:rkm.narainpur@gmail.com"
              className="hidden md:flex items-center gap-1 hover:text-[#F5C200] transition-colors min-w-0 truncate"
            >
              <Mail className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
              <span className="truncate">rkm.narainpur@gmail.com</span>
            </a>
          </div>
          <div className="devanagari text-[#F5C200] font-semibold tracking-wide text-[9px] sm:text-[10px] text-right leading-tight max-w-[55%] sm:max-w-none">
            आत्मनो मोक्षार्थं जगद्धिताय च
          </div>
        </div>
      </div>

      <div className="gold-gradient h-px" aria-hidden="true" />

      <div className="bg-white/95 border-b border-blue-100 supports-[backdrop-filter]:backdrop-blur-sm">
        <div className="container-site">
          <div className="flex h-12 sm:h-14 lg:h-[3.75rem] items-center justify-between gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink lg:max-w-[14rem] xl:max-w-none"
              aria-label="Ramakrishna Mission College, Narayanpur — Home"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 shrink-0 drop-shadow-md">
                <Image
                  src={RKM_LOGO_URL}
                  alt="Ramakrishna Mission Official Emblem"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 36px, 44px"
                  priority
                />
              </div>
              <div className="leading-tight min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#0D2660] leading-tight truncate sm:whitespace-normal">
                  {SITE_FULL_NAME}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#C8201A] font-semibold truncate">
                  {SITE_LOCATION}
                </div>
                <div className="text-[9px] text-gray-400 hidden md:block leading-snug">
                  A Branch Centre of Belur Math
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex flex-1 items-center justify-center flex-nowrap gap-0 min-w-0 mx-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="relative group shrink-0">
                  <Link
                    href={link.href}
                    className="flex items-center gap-0.5 px-2 xl:px-2.5 py-1 rounded-md text-[11px] xl:text-xs font-medium text-gray-700 hover:text-[#0D2660] hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    {link.label}
                    {"children" in link && link.children && (
                      <ChevronDown
                        className="h-3 w-3 opacity-60 group-hover:rotate-180 transition-transform shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                  {"children" in link && link.children && (
                    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="w-52 rounded-xl border border-blue-100 bg-white shadow-xl overflow-hidden">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0D2660] border-b border-blue-50 last:border-0 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <AuthNav />
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex h-8 bg-[#C8201A] hover:bg-[#9B1812] text-white font-semibold px-3 shadow-sm text-xs"
              >
                <Link href="/admissions/apply">Apply Now</Link>
              </Button>
              <Button
                asChild
                size="icon-sm"
                className="sm:hidden bg-[#C8201A] hover:bg-[#9B1812] text-white shrink-0"
                aria-label="Apply for admission"
              >
                <Link href="/admissions/apply">+</Link>
              </Button>
              <button
                type="button"
                className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-[#0D2660] transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="gold-gradient h-0.5" aria-hidden="true" />

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
