import { requireRole } from "@/lib/auth/helpers";
import { listUsers } from "@/lib/actions/admin-users";
import { UserRoleTable } from "@/components/admin/UserRoleTable";

export default async function AdminUsersPage() {
  await requireRole(["admin", "super_admin"]);
  const result = await listUsers();
  const users = result.ok ? result.data : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">User Management</h1>
      <p className="text-sm text-gray-500 mb-8">Assign roles to staff and applicants</p>
      {users.length === 0 ? (
        <p className="text-gray-400 text-sm">No users found</p>
      ) : (
        <UserRoleTable users={users} />
      )}
    </div>
  );
}
