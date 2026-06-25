import { requirePermission } from "@/lib/auth/helpers";
import { listStaffNotifications } from "@/lib/actions/staff-notifications";
import Link from "next/link";

export default async function AdminNotificationsPage() {
  await requirePermission("notifications", "view");
  const result = await listStaffNotifications(50);
  const items = result.ok ? result.data : [];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Notification Inbox</h1>
      <p className="text-sm text-gray-500 mb-8">All staff alerts for your role</p>

      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No notifications yet.</p>
      ) : (
        <ul className="divide-y divide-blue-50 bg-white rounded-xl border border-blue-100">
          {items.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href ?? "#"}
                className={`block px-5 py-4 hover:bg-blue-50/30 ${!n.read_at ? "bg-amber-50/30" : ""}`}
              >
                <div className="font-medium text-gray-900">{n.title}</div>
                {n.body && <p className="text-sm text-gray-500 mt-1">{n.body}</p>}
                <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString("en-IN")}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
