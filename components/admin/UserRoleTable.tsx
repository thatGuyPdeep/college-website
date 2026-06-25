"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserRole, setUserActive } from "@/lib/actions/admin-users";
import type { UserRow } from "@/lib/actions/admin-users";
import type { UserRole } from "@/lib/supabase/types";
import { roleLabel } from "@/lib/content/staff-roles";

export function UserRoleTable({
  users,
  assignableRoles,
  canDeactivate,
}: {
  users: UserRow[];
  assignableRoles: UserRole[];
  canDeactivate: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function changeRole(userId: string, role: UserRole) {
    setLoading(userId);
    const result = await updateUserRole(userId, role);
    setLoading(null);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success("Role updated");
    router.refresh();
  }

  async function toggleActive(userId: string, isActive: boolean) {
    setLoading(userId);
    const result = await setUserActive(userId, !isActive);
    setLoading(null);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success(isActive ? "User deactivated" : "User reactivated");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-blue-100 overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="navy-gradient text-white">
            <th className="text-left px-4 py-3 text-xs font-semibold">User</th>
            <th className="text-left px-4 py-3 text-xs font-semibold">Email</th>
            <th className="text-left px-4 py-3 text-xs font-semibold">Role</th>
            <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
            {canDeactivate && <th className="text-left px-4 py-3 text-xs font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-50">
          {users.map((u) => (
            <tr key={u.id} className={!u.is_active ? "opacity-60" : undefined}>
              <td className="px-4 py-3">{u.full_name ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">{u.email ?? "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={u.role}
                  disabled={loading === u.id}
                  onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                  className="border rounded-md px-2 py-1 text-xs max-w-[180px]"
                >
                  {assignableRoles.map((r) => (
                    <option key={r} value={r}>{roleLabel(r, "en")}</option>
                  ))}
                  {!assignableRoles.includes(u.role) && (
                    <option value={u.role}>{roleLabel(u.role, "en")}</option>
                  )}
                </select>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              {canDeactivate && (
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={loading === u.id}
                    onClick={() => toggleActive(u.id, u.is_active)}
                    className="text-xs text-[#C8201A] hover:underline"
                  >
                    {u.is_active ? "Deactivate" : "Reactivate"}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
