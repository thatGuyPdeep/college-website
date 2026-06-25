import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { UserRole } from "@/lib/supabase/types";

export function AdminShell({
  role,
  email,
  fullName,
  children,
}: {
  role: UserRole;
  email?: string | null;
  fullName?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0F4FA]">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(13,38,96,0.06) 0%, transparent 45%), radial-gradient(circle at 80% 100%, rgba(200,32,26,0.04) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <AdminSidebar role={role} email={email} />
      <div className="relative lg:pl-[17.5rem] min-h-screen flex flex-col">
        <AdminHeader role={role} email={email} fullName={fullName} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
