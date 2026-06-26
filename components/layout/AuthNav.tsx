"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, LayoutDashboard, Shield, User, GraduationCap } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { STAFF_ROLES, ERP_ROLES, ERP_ADMIN_ROLES } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/supabase/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AuthNavProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

function displayLabel(user: SupabaseUser) {
  const meta = user.user_metadata as { full_name?: string } | undefined;
  return meta?.full_name?.trim() || user.email?.split("@")[0] || "Account";
}

export function AuthNav({ variant = "desktop", onNavigate }: AuthNavProps) {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [ready, setReady] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        setRole((profile as { role?: UserRole } | null)?.role ?? null);
      } else {
        setRole(null);
      }

      setReady(true);
    }

    void loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        void supabase
          .from("profiles")
          .select("role")
          .eq("id", nextUser.id)
          .single()
          .then(({ data: profile }) => {
            setRole((profile as { role?: UserRole } | null)?.role ?? null);
          });
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Signed out");
      onNavigate?.();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (!ready) {
    return (
      <span
        className={cn(
          "inline-block rounded-lg bg-blue-50/60 animate-pulse",
          variant === "desktop" ? "h-8 w-16 hidden md:inline-flex" : "h-11 w-full"
        )}
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    if (variant === "mobile") {
      return (
        <Link
          href="/login"
          onClick={onNavigate}
          className="text-center py-3 text-sm text-gray-600 border border-blue-200 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center"
        >
          Login
        </Link>
      );
    }

    return (
      <Link
        href="/login"
        className="hidden md:inline-flex text-xs text-gray-600 hover:text-[#0D2660] px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors h-8 items-center"
      >
        Login
      </Link>
    );
  }

  const label = displayLabel(user);
  const isStaff = role != null && STAFF_ROLES.includes(role);
  const isErp   = role != null && ERP_ROLES.includes(role);
  const isFacultyErp = role != null && ERP_ADMIN_ROLES.includes(role) && !isStaff;

  if (variant === "mobile") {
    return (
      <div className="col-span-2 space-y-3">
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
            <User className="h-4 w-4 shrink-0" aria-hidden="true" />
            Signed in as {label}
          </div>
          {user.email && (
            <p className="text-xs text-green-700/80 mt-1 truncate">{user.email}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {isErp && (
            <Link
              href="/student"
              onClick={onNavigate}
              className="col-span-2 text-center py-3 text-sm text-[#0D2660] border border-[#0D2660]/30 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Student Portal
            </Link>
          )}
          <Link
            href="/admissions/dashboard"
            onClick={onNavigate}
            className="text-center py-3 text-sm text-[#0D2660] border border-[#0D2660]/30 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Applications
          </Link>
          {isStaff ? (
            <Link
              href="/admin"
              onClick={onNavigate}
              className="text-center py-3 text-sm text-[#0D2660] border border-[#0D2660]/30 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center gap-1.5"
            >
              <Shield className="h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
          ) : isFacultyErp ? (
            <Link
              href="/admin/erp"
              onClick={onNavigate}
              className="text-center py-3 text-sm text-[#0D2660] border border-[#0D2660]/30 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center gap-1.5"
            >
              <Shield className="h-4 w-4" aria-hidden="true" />
              ERP
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="text-center py-3 text-sm text-gray-600 border border-blue-200 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          )}
        </div>
        {(isStaff || isFacultyErp) && (
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="w-full text-center py-3 text-sm text-gray-600 border border-blue-200 rounded-xl hover:bg-blue-50 touch-target min-h-11 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#0D2660] px-2.5 py-1 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100/80 transition-colors h-8 max-w-[200px]"
        aria-label={`Signed in as ${label}. Open account menu.`}
      >
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0D2660] text-white text-[10px] font-semibold uppercase">
          {label.charAt(0)}
        </span>
        <span className="truncate font-medium">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="auth-account-menu w-56 bg-white text-gray-900 shadow-lg border border-gray-200"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs text-muted-foreground">Signed in</p>
            <p className="truncate font-medium text-[#0D2660]">{user.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
          render={<Link href="/admissions/dashboard" />}
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          My Applications
        </DropdownMenuItem>
        {isErp && (
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            render={<Link href="/student" />}
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Student Portal
          </DropdownMenuItem>
        )}
        {isStaff && (
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            render={<Link href="/admin" />}
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            Admin
          </DropdownMenuItem>
        )}
        {isFacultyErp && (
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            render={<Link href="/admin/erp" />}
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            ERP Console
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
