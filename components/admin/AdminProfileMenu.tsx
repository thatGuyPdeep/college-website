"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Shield, User } from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";
import { roleLabel } from "@/lib/content/staff-roles";
import { RoleBadge } from "@/components/admin/RoleBadge";
import { MFA_REQUIRED_ROLES } from "@/lib/auth/roles";

export function AdminProfileMenu({
  role,
  email,
  fullName,
}: {
  role: UserRole;
  email?: string | null;
  fullName?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayName = fullName?.trim() || email?.split("@")[0] || "Staff";
  const needsMfa = MFA_REQUIRED_ROLES.includes(role);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-blue-100 bg-white hover:bg-blue-50 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D2660] text-white text-sm font-bold">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block text-left max-w-[7rem]">
          <span className="block text-xs font-semibold text-[#0D2660] truncate">{displayName}</span>
          <span className="block text-[10px] text-gray-400 truncate">{roleLabel(role, "en")}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white rounded-xl border border-blue-100 shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-blue-50 bg-[#F8FAFC]">
            <p className="font-semibold text-sm text-[#0D2660] truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
            <div className="mt-2">
              <RoleBadge role={role} />
            </div>
          </div>
          <ul className="py-1">
            {needsMfa && (
              <li>
                <Link
                  href="/mfa"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  <Shield className="h-4 w-4 text-[#0D2660]" />
                  MFA security
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/admin/notifications"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4 text-[#0D2660]" />
                Notification inbox
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
