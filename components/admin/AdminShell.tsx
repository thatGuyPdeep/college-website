import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { UserRole } from "@/lib/supabase/types";

export function AdminShell({
  role,
  email,
  children,
}: {
  role: UserRole;
  email?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar role={role} email={email} />
      <div className="lg:pl-64 min-h-screen">
        <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 pt-14 lg:pt-10">{children}</main>
      </div>
    </div>
  );
}
