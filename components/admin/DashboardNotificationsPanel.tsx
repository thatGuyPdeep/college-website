import Link from "next/link";
import { listStaffNotifications } from "@/lib/actions/staff-notifications";
import { Bell, ArrowRight } from "lucide-react";

export async function DashboardNotificationsPanel() {
  const result = await listStaffNotifications(8);
  const items = result.ok ? result.data : [];
  const unread = items.filter((n) => !n.read_at);

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#0D2660]" aria-hidden="true" />
          <span className="font-semibold text-sm text-[#0D2660]">Notifications</span>
          {unread.length > 0 && (
            <span className="text-[10px] font-bold bg-[#C8201A] text-white px-1.5 py-0.5 rounded-full">
              {unread.length}
            </span>
          )}
        </div>
        <Link href="/admin/notifications" className="text-xs text-[#C8201A] hover:underline inline-flex items-center gap-1">
          Inbox <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications yet</p>
      ) : (
        <ul className="divide-y divide-blue-50 max-h-64 overflow-y-auto">
          {items.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href ?? "/admin/notifications"}
                className={`block px-4 py-3 hover:bg-blue-50/50 transition-colors ${
                  !n.read_at ? "bg-amber-50/40" : ""
                }`}
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{n.title}</p>
                {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.body}</p>}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString("en-IN")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
