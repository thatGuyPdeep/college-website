"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import {
  getUnreadNotificationCount,
  listStaffNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type StaffNotification,
} from "@/lib/actions/staff-notifications";
import { cn } from "@/lib/utils";

const POLL_MS = 30_000;

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<StaffNotification[]>([]);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      const [countRes, listRes] = await Promise.all([
        getUnreadNotificationCount(),
        listStaffNotifications(15),
      ]);
      if (countRes.ok) setUnread(countRes.data);
      if (listRes.ok) setItems(listRes.data);
    });
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleOpen() {
    setOpen((v) => !v);
    if (!open) refresh();
  }

  async function handleClick(n: StaffNotification) {
    if (!n.read_at) {
      await markNotificationRead(n.id);
      setUnread((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (n.href) router.push(n.href);
    router.refresh();
  }

  async function handleMarkAll() {
    const res = await markAllNotificationsRead();
    if (!res.ok) { toast.error(res.error); return; }
    setUnread(0);
    refresh();
    toast.success("All notifications marked read");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative p-2.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-[#0D2660] transition-colors"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#C8201A] text-white text-[10px] font-bold">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 bg-white rounded-xl border border-blue-100 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50 bg-[#F8FAFC]">
              <span className="font-semibold text-sm text-[#0D2660]">Notifications</span>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAll}
                    disabled={pending}
                    className="text-xs text-[#C8201A] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
                <Link href="/admin/notifications" className="text-xs text-[#0D2660] hover:underline" onClick={() => setOpen(false)}>
                  View all
                </Link>
              </div>
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y divide-blue-50">
              {items.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet</li>
              ) : (
                items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(n)}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-blue-50/50 transition-colors",
                        !n.read_at && "bg-amber-50/40",
                      )}
                    >
                      <div className="text-sm font-medium text-gray-900">{n.title}</div>
                      {n.body && <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</div>}
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleString("en-IN")}
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
