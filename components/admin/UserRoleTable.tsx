"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/admin-users";
import type { UserRow } from "@/lib/actions/admin-users";
import type { UserRole } from "@/lib/supabase/types";

const ROLES: UserRole[] = [
  "applicant", "faculty_applicant", "student", "faculty",
  "admissions_staff", "hr_staff", "content_editor", "admin", "super_admin",
];

export function UserRoleTable({ users }: { users: UserRow[] }) {
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

  return (
    <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="navy-gradient text-white">
            <th className="text-left px-4 py-3 text-xs font-semibold">User</th>
            <th className="text-left px-4 py-3 text-xs font-semibold">Email</th>
            <th className="text-left px-4 py-3 text-xs font-semibold">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-50">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3">{u.full_name ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">{u.email ?? "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={u.role}
                  disabled={loading === u.id}
                  onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                  className="border rounded-md px-2 py-1 text-xs"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
