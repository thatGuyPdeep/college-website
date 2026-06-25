"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#C8201A] px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
