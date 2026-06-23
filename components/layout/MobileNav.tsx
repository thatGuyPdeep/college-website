"use client";

import Link from "next/link";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AuthNav } from "@/components/layout/AuthNav";
import { FontSizeControl } from "@/components/layout/FontSizeControl";
import { NAV_LINKS } from "@/lib/utils/constants";
import { UTILITY_BAR_LINKS } from "@/lib/content/design-portal";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent id="mobile-menu" side="right" className="w-full sm:max-w-sm p-0 gap-0 border-l border-blue-100">
        <SheetHeader className="border-b border-blue-100 bg-[#F0F4FF] px-5 py-4 text-left">
          <SheetTitle className="text-[#0D2660] font-bold text-lg">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation links</SheetDescription>
          <div className="flex flex-col gap-2 pt-2 text-sm">
            <a
              href="tel:+917781252251"
              className="flex items-center gap-2 text-gray-600 hover:text-[#0D2660] min-h-11"
            >
              <Phone className="h-4 w-4 shrink-0 text-[#C8201A]" aria-hidden="true" />
              07781-252251
            </a>
            <a
              href="mailto:rkm.narainpur@gmail.com"
              className="flex items-center gap-2 text-gray-600 hover:text-[#0D2660] min-h-11 break-all"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#C8201A]" aria-hidden="true" />
              rkm.narainpur@gmail.com
            </a>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                {"children" in link && link.children ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-[#0D2660] min-h-11 transition-colors"
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.href ? null : link.href)
                      }
                      aria-expanded={openDropdown === link.href}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          openDropdown === link.href && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {openDropdown === link.href && (
                      <ul className="ml-3 mb-2 border-l-2 border-[#F5C200] pl-3 space-y-0.5">
                        <li>
                          <Link
                            href={link.href}
                            onClick={close}
                            className="block rounded-md py-2.5 px-2 text-sm text-gray-600 hover:text-[#0D2660] min-h-11"
                          >
                            Overview
                          </Link>
                        </li>
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={close}
                              className="block rounded-md py-2.5 px-2 text-sm text-gray-600 hover:text-[#0D2660] min-h-11"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-[#0D2660] min-h-11 transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-blue-100 p-4 space-y-3 bg-white">
          <div className="flex flex-wrap gap-2 pb-1">
            {UTILITY_BAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-xs px-2.5 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-[#0D2660]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link href="/" onClick={close} className="text-sm text-gray-600 font-devanagari hover:text-[#0D2660]">
              हिन्दी
            </Link>
            <FontSizeControl variant="light" />
          </div>
          <AuthNav variant="mobile" onNavigate={close} />
          <Button asChild className="w-full bg-[#C8201A] hover:bg-[#9B1812] text-white min-h-11">
            <Link href="/admissions/apply" onClick={close}>
              Apply Now
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
