import Link from "next/link";
import { requireRole } from "@/lib/auth/helpers";
import { listAuditLogs } from "@/lib/actions/admin-audit";

export default async function AdminAuditPage() {
  await requireRole(["admin", "super_admin", "admissions_staff"]);
  const result = await listAuditLogs(150);
  const logs = result.ok ? result.data : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link> / Audit Log
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-6">Audit Log</h1>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-400">No audit entries yet.</p>
      ) : (
        <div className="table-responsive bg-white border border-blue-100 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0D2660] text-white text-left">
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Entity</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} className={i % 2 ? "bg-blue-50/30" : ""}>
                  <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2">
                    <span className="font-medium">{log.entity_type}</span>
                    <span className="block text-xs text-gray-400 font-mono">{log.entity_id.slice(0, 8)}…</span>
                  </td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2 text-xs text-gray-600 max-w-xs truncate">
                    {log.note ?? JSON.stringify(log.new_value ?? {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
