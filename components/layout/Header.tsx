"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, ChevronDown, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthNav } from "@/components/layout/AuthNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { UtilityTopBar } from "@/components/layout/UtilityTopBar";
import { NAV_LINKS, RKM_LOGO_URL, SITE_FULL_NAME, SITE_HINDI_NAME, SITE_LOCATION, RKM_FACTS } from "@/lib/utils/constants";

const NAV_SHORT_NAME = "RKMV College";

/** Single-column dropdown — only visible when its parent is the active menu */
function MegaMenuPanel({
  items,
  open,
}: {
  items: { label: string; href: string }[];
  open: boolean;
}) {
  if (!open) return null;

  return (
    <div className="absolute top-full left-0 pt-1 z-50">
      <div className="min-w-[13rem] max-w-[16rem] rounded-b-md border border-gray-200 bg-white shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {items.map((child) => (
          <Link
            key={`${child.href}-${child.label}`}
            href={child.href}
            className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-[#f9fbfd] hover:text-[#B80F0A] border-b border-gray-50 last:border-b-0 transition-colors leading-snug"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Chrome (utility + brand) scrolls off with the page.
 * Nav becomes position:fixed once chrome clears the viewport top.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const chrome = chromeRef.current;
    const nav = navRef.current;
    if (!chrome || !nav) return;

    let ticking = false;

    const update = () => {
      setNavHeight(nav.offsetHeight);
      setPinned(chrome.getBoundingClientRect().bottom <= 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* Utility + brand — normal document flow, scrolls away */}
      <div ref={chromeRef} className="w-full">
        <UtilityTopBar />

        <div className="iitd-brand-bar bg-white border-b border-gray-200 shadow-sm">
          <div className="container-site py-2.5 sm:py-3">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
                aria-label={`${SITE_FULL_NAME}, Narayanpur — Home`}
              >
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                  <Image
                    src={RKM_LOGO_URL}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="64px"
                    priority
                  />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-devanagari hidden sm:block text-xs font-semibold text-[#0D2660] leading-snug">
                    {SITE_HINDI_NAME}, नारायणपुर
                  </div>
                  <div className="font-heading font-bold text-sm sm:text-lg text-[#0D2660] leading-tight tracking-tight">
                    {SITE_FULL_NAME}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                    A Branch Centre of Ramakrishna Math & Mission, Belur Math
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1.5 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-[#0D2660] text-white">
                      NEP 2020
                    </span>
                    <a
                      href="https://smkvbastar.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-[#F5C200]/25 text-[#0D2660] border border-[#F5C200]/50 hover:bg-[#F5C200]/40"
                    >
                      {RKM_FACTS.university}
                    </a>
                  </div>
                </div>
              </Link>

              <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0 text-right">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-[#B80F0A] shrink-0" aria-hidden="true" />
                  <span>{SITE_LOCATION}, Chhattisgarh – 494 661</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/search"
                    className="p-1.5 text-gray-500 hover:text-[#0D2660] rounded hover:bg-gray-100"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </Link>
                  <AuthNav />
                  <Button
                    asChild
                    size="sm"
                    className="h-7 bg-[#B80F0A] hover:bg-[#9B1812] text-white text-xs font-bold uppercase tracking-wide px-3"
                  >
                    <Link href="/admissions/apply">Apply Now</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:hidden shrink-0">
                <Button
                  asChild
                  size="sm"
                  className="h-7 bg-[#B80F0A] hover:bg-[#9B1812] text-white text-xs font-bold px-3"
                >
                  <Link href="/admissions/apply">Apply</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder keeps page content from jumping when nav becomes fixed */}
      {pinned && navHeight > 0 && (
        <div style={{ height: navHeight }} aria-hidden="true" className="w-full shrink-0" />
      )}

      {/* Nav bar — fixed at top once chrome has scrolled away */}
      <nav
        ref={navRef}
        aria-label="Site navigation"
        className={`z-50 iitd-nav-bar bg-[#2b2d3b] w-full left-0 right-0 ${
          pinned ? "fixed top-0 shadow-lg" : "relative"
        }`}
      >
        {/* Mobile nav */}
        <div className="lg:hidden border-b border-[#B80F0A]/30">
          <div className="container-site flex items-center justify-between h-12 gap-2">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="relative w-7 h-7 shrink-0">
                <Image src={RKM_LOGO_URL} alt="" fill className="object-contain" sizes="28px" />
              </div>
              <span className="text-xs font-bold text-white truncate">{NAV_SHORT_NAME}</span>
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <Link href="/search" className="p-1.5 text-white/80 hover:text-white" aria-label="Search">
                <Search className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="p-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:block relative">
          <div className="container-site">
            <div className="flex items-stretch h-10">
              <div
                className={`flex items-center flex-nowrap gap-0 flex-1 min-w-0 ${
                  pinned ? "pl-[10.5rem]" : ""
                }`}
                role="menubar"
                onMouseLeave={() => setOpenMenu(null)}
              >
                {NAV_LINKS.map((link) => (
                  <div
                    key={link.href}
                    className="relative h-full flex items-stretch"
                    onMouseEnter={() => {
                      if ("children" in link && link.children) setOpenMenu(link.href);
                      else setOpenMenu(null);
                    }}
                    onFocus={() => {
                      if ("children" in link && link.children) setOpenMenu(link.href);
                    }}
                  >
                    <Link
                      href={link.href}
                      role="menuitem"
                      aria-expanded={"children" in link && link.children ? openMenu === link.href : undefined}
                      className={`flex items-center gap-0.5 px-2.5 xl:px-3 h-full text-[11px] font-medium transition-colors whitespace-nowrap uppercase tracking-wide ${
                        openMenu === link.href
                          ? "text-white bg-[#B80F0A]"
                          : "text-white/90 hover:text-white hover:bg-[#B80F0A]"
                      }`}
                    >
                      {link.label}
                      {"children" in link && link.children && (
                        <ChevronDown className="h-3 w-3 opacity-70 shrink-0" aria-hidden="true" />
                      )}
                    </Link>
                    {"children" in link && link.children && (
                      <MegaMenuPanel items={[...link.children]} open={openMenu === link.href} />
                    )}
                  </div>
                ))}
              </div>

              <div className={`flex items-center gap-2 shrink-0 ${pinned ? "" : "hidden"}`}>
                <Link href="/search" className="p-1.5 text-white/80 hover:text-white" aria-label="Search">
                  <Search className="h-4 w-4" />
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="h-7 bg-[#B80F0A] hover:bg-[#9B1812] text-white text-[10px] font-bold uppercase px-3"
                >
                  <Link href="/admissions/apply">Apply</Link>
                </Button>
              </div>
            </div>
          </div>

          {pinned && (
            <Link
              href="/"
              className="absolute left-[clamp(1rem,4vw,2rem)] top-0 bottom-0 flex items-center gap-2 border-r border-white/10 pr-3 max-w-[10.5rem]"
              aria-label={`${SITE_FULL_NAME} — Home`}
            >
              <div className="relative w-7 h-7 shrink-0">
                <Image src={RKM_LOGO_URL} alt="" fill className="object-contain" sizes="28px" />
              </div>
              <span className="text-[11px] font-bold text-white whitespace-nowrap truncate">
                {NAV_SHORT_NAME}
              </span>
            </Link>
          )}
        </div>
      </nav>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}
