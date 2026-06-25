"use client";

import Link from "next/link";
import {
  Calendar,
  Briefcase,
  FileText,
  CreditCard,
  Gift,
  Globe,
  Mail,
} from "lucide-react";
import { FontSizeControl } from "@/components/layout/FontSizeControl";
import { AccessibilityPanel } from "@/components/layout/AccessibilityPanel";

const QUICK_LINKS = [
  { label: "Jobs", href: "/careers", icon: Briefcase },
  { label: "Calendar", href: "/academics/calendar", icon: Calendar },
  { label: "Tenders", href: "/tenders", icon: FileText },
  { label: "Donate", href: "/donate", icon: Gift },
  { label: "Payment", href: "/admissions/fees", icon: CreditCard },
] as const;

/** IIT Delhi top utility bar — crimson strip with icons */
export function UtilityTopBar() {
  return (
    <div className="iitd-utility-bar hidden md:block">
      <div className="container-site">
        <div className="flex items-center justify-between h-9 text-[11px] text-white/95">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Utility links">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 hover:text-[#F5C200] transition-colors whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5 opacity-90" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.facebook.com/RKMNarainpur"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5C200] transition-colors"
              aria-label="Facebook"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
            <Link href="/" className="font-devanagari hover:text-[#F5C200] transition-colors">
              हिन्दी /
            </Link>
            <FontSizeControl variant="dark" />
            <AccessibilityPanel variant="dark" />
            <a
              href="mailto:rkm.narainpur@gmail.com"
              className="inline-flex items-center gap-1 hover:text-[#F5C200] transition-colors"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
