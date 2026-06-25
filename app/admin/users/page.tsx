import { requirePermission, getUserProfile } from "@/lib/auth/helpers";
import { listUsers, getUserAdminCapabilities } from "@/lib/actions/admin-users";
import { listPendingInvites } from "@/lib/actions/staff-invites";
import { UserRoleTable } from "@/components/admin/UserRoleTable";
import { StaffInviteForm } from "@/components/admin/StaffInviteForm";
import type { UserRole } from "@/lib/supabase/types";
import { roleLabel } from "@/lib/content/staff-roles";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission("users", "view");
  const profile = await getUserProfile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;

  const params = await searchParams;
  const search = params.q ?? "";
  const page = Number(params.page ?? "1") || 1;

  const [usersRes, capabilities, invitesRes] = await Promise.all([
    listUsers({ search, page, limit: 25 }),
    getUserAdminCapabilities(role),
    listPendingInvites(),
  ]);

  const users = usersRes.ok ? usersRes.data.users : [];
  const total = usersRes.ok ? usersRes.data.total : 0;
  const invites = capabilities.canInvite && invitesRes.ok ? invitesRes.data : [];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">User Management</h1>
      <p className="text-sm text-gray-500 mb-8">
        Assign roles to staff.
        {role === "admin" ? " College admins cannot assign super admin." : ""}
      </p>

      {capabilities.canInvite && (
        <div className="mb-8">
          <StaffInviteForm assignableRoles={capabilities.assignableRoles} />
        </div>
      )}

      {invites.length > 0 && (
        <div className="mb-8 bg-white border border-blue-100 rounded-xl p-5">
          <h3 className="font-semibold text-[#0D2660] mb-3">Pending invitations</h3>
          <ul className="text-sm space-y-2">
            {invites.map((inv) => (
              <li key={inv.id} className="flex flex-wrap justify-between gap-2 text-gray-600">
                <span>{inv.email}</span>
                <span>
                  {roleLabel(inv.role, "en")} · expires {new Date(inv.expires_at).toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="mb-4 flex gap-2">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search name or email…"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="px-4 py-2 text-sm bg-[#0D2660] text-white rounded-lg">Search</button>
      </form>

      {users.length === 0 ? (
        <p className="text-gray-400 text-sm">No users found</p>
      ) : (
        <UserRoleTable
          users={users}
          assignableRoles={capabilities.assignableRoles}
          canDeactivate={capabilities.canDeactivate}
        />
      )}

      {total > 25 && (
        <p className="text-xs text-gray-400 mt-4">Showing page {page} · {total} users total</p>
      )}
    </div>
  );
}
