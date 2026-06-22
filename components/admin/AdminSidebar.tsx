"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type { UserRole } from "@/lib/supabase/types";
import { navItemsForRole } from "@/lib/admin/nav";
import { RKM_LOGO_URL, SITE_FULL_NAME } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

export function AdminSidebar({ role, email }: { role: UserRole; email?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = navItemsForRole(role);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Admin navigation">
      {items.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-[#C8201A] text-white"
                : "text-blue-100 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-[#0D2660] text-white shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close admin menu" : "Open admin menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-[#071540] text-white flex flex-col border-r border-blue-900 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-blue-900">
          <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <Image src={RKM_LOGO_URL} alt="" width={36} height={36} className="rounded-full bg-white p-0.5" />
            <div className="min-w-0">
              <div className="font-semibold text-sm text-white truncate">Admin</div>
              <div className="text-[10px] text-blue-300 truncate">{SITE_FULL_NAME}</div>
            </div>
          </Link>
          {email && <p className="text-xs text-blue-300 mt-2 truncate">{email}</p>}
        </div>

        <div className="flex-1 overflow-y-auto">{nav}</div>

        <div className="p-3 border-t border-blue-900 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="h-3.5 w-3.5" /> View public site
          </Link>
        </div>
      </aside>
    </>
  );
}
