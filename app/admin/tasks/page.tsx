import Link from "next/link";
import { requirePermission, getUserProfile } from "@/lib/auth/helpers";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";
import { StaffTasksPanel } from "@/components/admin/StaffTasksPanel";

export default async function AdminTasksPage() {
  await requirePermission("tasks", "view");
  const profile = await getUserProfile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  const canAssign = can(role, "tasks", "edit");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link> / Tasks
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Staff Tasks</h1>
      <p className="text-sm text-gray-500 mb-8">
        {canAssign ? "Assign and track tasks across your team." : "Your assigned tasks appear below."}
      </p>
      <StaffTasksPanel canAssign={canAssign} />
    </div>
  );
}
