import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { MFA_REQUIRED_ROLES } from "@/lib/auth/roles";

const PROTECTED_ROUTES: { prefix: string; roles: string[] | null }[] = [
  { prefix: "/admin/erp", roles: ["faculty", "admin", "super_admin"] },
  { prefix: "/admin/ai",  roles: ["admin", "super_admin"] },
  { prefix: "/admin",     roles: ["admissions_staff", "hr_staff", "content_editor", "admin", "super_admin"] },
  { prefix: "/admissions/apply",     roles: null },
  { prefix: "/admissions/dashboard", roles: null },
  { prefix: "/careers/apply",        roles: null },
  { prefix: "/careers/dashboard",    roles: null },
  { prefix: "/student",              roles: ["student", "faculty", "admin", "super_admin"] },
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

  for (const { prefix, roles } of PROTECTED_ROUTES) {
    if (!path.startsWith(prefix)) continue;

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    if (roles) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userRole = (profile as any)?.role ?? null;

      if (!userRole || !roles.includes(userRole)) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
    break;
  }

  // MFA gate for admin/super_admin on admin routes
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
