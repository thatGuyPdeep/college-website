"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type { UserRole } from "@/lib/supabase/types";
import { navItemsForRole, type AdminNavItem } from "@/lib/admin/nav";
import type { AdminModule } from "@/lib/auth/permissions";
import { RKM_LOGO_URL, SITE_FULL_NAME } from "@/lib/utils/constants";
import { RoleBadge } from "@/components/admin/RoleBadge";
import { cn } from "@/lib/utils";

const SECTIONS: { label: string; modules: AdminModule[] }[] = [
  { label: "Overview", modules: ["dashboard", "notifications"] },
  { label: "Operations", modules: ["admissions", "recruitment", "contact", "payments", "examination", "erp"] },
  { label: "Content & quality", modules: ["content", "iqac", "compliance"] },
  { label: "Administration", modules: ["audit", "ai", "users", "settings"] },
];

function groupNavItems(items: AdminNavItem[]) {
  const byModule = new Map(items.map((i) => [i.module, i]));
  return SECTIONS.map((section) => ({
    label: section.label,
    items: section.modules.map((m) => byModule.get(m)).filter(Boolean) as AdminNavItem[],
  })).filter((s) => s.items.length > 0);
}

export function AdminSidebar({ role, email }: { role: UserRole; email?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sections = groupNavItems(navItemsForRole(role));

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <nav className="flex flex-col gap-5 p-3" aria-label="Admin navigation">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-blue-400/80">
            {section.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-white text-[#0D2660] shadow-md"
                      : "text-blue-100 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active ? "bg-[#C8201A] text-white" : "bg-white/10 text-blue-200 group-hover:bg-white/15",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && <ChevronRight className="h-4 w-4 text-[#C8201A] shrink-0" aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-[#0D2660] text-white shadow-lg ring-2 ring-[#F5C200]/40"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close admin menu" : "Open admin menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-[#071540]/60 backdrop-blur-sm"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-[17.5rem] flex flex-col transition-transform lg:translate-x-0",
          "bg-gradient-to-b from-[#071540] to-[#0D2660] text-white border-r border-blue-900/50 shadow-xl",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="gold-gradient h-1 shrink-0" aria-hidden="true" />

        <div className="p-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <div className="relative">
              <Image
                src={RKM_LOGO_URL}
                alt=""
                width={40}
                height={40}
                className="rounded-full bg-white p-0.5 ring-2 ring-[#F5C200]/50"
              />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-white">Staff Portal</div>
              <div className="text-[10px] text-blue-300 leading-tight line-clamp-2">{SITE_FULL_NAME}</div>
            </div>
          </Link>
          <div className="mt-3 space-y-2">
            <RoleBadge role={role} showHindi className="!bg-white/10 !border-white/15 w-full" />
            {email && <p className="text-[11px] text-blue-300 truncate px-0.5">{email}</p>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto admin-scrollbar">{nav}</div>

        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-blue-200 hover:text-white rounded-xl hover:bg-white/10 border border-white/10 transition-colors"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View public website
          </Link>
        </div>
      </aside>
    </>
  );
}
