import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/helpers";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_LAYOUT_ROLES } from "@/lib/admin/nav";
import type { UserRole } from "@/lib/supabase/types";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  if (!profile) redirect("/login?redirect=/admin");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((profile as any).is_active === false) redirect("/login?error=deactivated");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any).role as UserRole;
  if (!ADMIN_LAYOUT_ROLES.includes(role)) {
    redirect("/login?error=staff_required&redirect=/admin");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const email = (profile as any).email as string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fullName = (profile as any).full_name as string | null;

  return (
    <AdminShell role={role} email={email} fullName={fullName}>
      {children}
    </AdminShell>
  );
}
