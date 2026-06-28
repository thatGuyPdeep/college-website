import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { MFA_REQUIRED_ROLES, STAFF_ROLES } from "@/lib/auth/roles";

const PROTECTED_ROUTES: { prefix: string; roles: string[] | null }[] = [
  { prefix: "/admin/erp", roles: ["faculty", "hod", "admin", "super_admin"] },
  { prefix: "/admin/users", roles: ["admin", "super_admin"] },
  { prefix: "/admin/settings", roles: ["admin", "super_admin"] },
  { prefix: "/admin/ai", roles: ["admin", "super_admin", "principal"] },
  { prefix: "/admin/examination", roles: ["examination_staff", "admin", "super_admin"] },
  { prefix: "/admin/iqac", roles: ["iqac_coordinator", "principal", "admin", "super_admin"] },
  { prefix: "/admin/compliance", roles: ["principal", "admin", "super_admin"] },
  { prefix: "/admin/payments", roles: ["admissions_staff", "accounts_staff", "admin", "super_admin", "principal"] },
  { prefix: "/admin/admissions", roles: ["admissions_staff", "hod", "admin", "super_admin"] },
  { prefix: "/admin/contact", roles: ["admissions_staff", "examination_staff", "admin", "super_admin", "principal"] },
  { prefix: "/admin/recruitment", roles: ["hr_staff", "admin", "super_admin"] },
  { prefix: "/admin/content", roles: ["content_editor", "admin", "super_admin"] },
  { prefix: "/admin/audit", roles: ["admissions_staff", "principal", "admin", "super_admin"] },
  { prefix: "/admin/tasks", roles: STAFF_ROLES as string[] },
  { prefix: "/admin/search", roles: STAFF_ROLES as string[] },
  { prefix: "/admin/admissions/seats", roles: ["admissions_staff", "admin", "super_admin"] },
  { prefix: "/admin", roles: STAFF_ROLES as string[] },
  { prefix: "/admissions/application-form", roles: null },
  { prefix: "/admissions/dashboard", roles: null },
  { prefix: "/careers/apply", roles: null },
  { prefix: "/careers/dashboard", roles: null },
  { prefix: "/student", roles: ["student", "faculty", "hod", "admin", "super_admin"] },
];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  let userRole: string | null = null;
  let isActive = true;

  for (const { prefix, roles } of PROTECTED_ROUTES) {
    if (!path.startsWith(prefix)) continue;

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    if (roles) {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileErr) {
        console.error("[proxy] profile lookup failed:", profileErr.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userRole = (profile as any)?.role ?? null;

      if (!userRole || !roles.includes(userRole)) {
        const url = request.nextUrl.clone();
        if (path.startsWith("/admin")) {
          url.pathname = "/login";
          url.searchParams.set("error", "staff_required");
          url.searchParams.set("redirect", path);
        } else {
          url.pathname = "/login";
          url.searchParams.set("error", "staff_required");
        }
        return NextResponse.redirect(url);
      }
    }
    break;
  }

  if (
    user &&
    path.startsWith("/admin") &&
    !path.startsWith("/mfa")
  ) {
    if (!userRole) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userRole = (profile as any)?.role ?? null;
    }

    // Deactivated check (optional column — only block when explicitly false)
    const { data: activeRow } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", user.id)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isActive = (activeRow as any)?.is_active !== false;

    if (!isActive) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "deactivated");
      return NextResponse.redirect(url);
    }

    if (userRole && MFA_REQUIRED_ROLES.includes(userRole as typeof MFA_REQUIRED_ROLES[number])) {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
        const url = request.nextUrl.clone();
        url.pathname = "/mfa";
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
