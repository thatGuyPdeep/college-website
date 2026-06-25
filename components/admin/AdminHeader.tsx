import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { roleLabel } from "@/lib/content/staff-roles";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function AdminHeader({
  role,
  email,
  fullName,
}: {
  role: UserRole;
  email?: string | null;
  fullName?: string | null;
}) {
  const displayName = fullName ?? email?.split("@")[0] ?? "Staff";

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100/80 bg-white/90 backdrop-blur-md">
      <div className="gold-gradient h-0.5 w-full opacity-80" aria-hidden="true" />
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 pl-10 lg:pl-0">
          <p className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#F5C200]" aria-hidden="true" />
            {greeting()}
          </p>
          <p className="font-semibold text-[#0D2660] truncate leading-tight">{displayName}</p>
          <p className="text-[11px] text-gray-500 truncate hidden sm:block">
            {roleLabel(role, "en")} · <span className="devanagari">{roleLabel(role, "hi")}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <NotificationBell />
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#0D2660] px-3 py-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Public site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
