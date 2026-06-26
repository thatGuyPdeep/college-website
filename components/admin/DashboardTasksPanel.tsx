import Link from "next/link";
import { listStaffTasks } from "@/lib/actions/admin-tasks";
import { ListTodo, ArrowRight } from "lucide-react";

export async function DashboardTasksPanel() {
  const result = await listStaffTasks();
  const tasks = result.ok ? result.data : [];
  const open = tasks.filter((t) => !t.completed_at).slice(0, 6);

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-[#0D2660]" aria-hidden="true" />
          <span className="font-semibold text-sm text-[#0D2660]">Your tasks</span>
          {open.length > 0 && (
            <span className="text-[10px] font-bold bg-[#0D2660] text-white px-1.5 py-0.5 rounded-full">
              {open.length}
            </span>
          )}
        </div>
        <Link href="/admin/tasks" className="text-xs text-[#C8201A] hover:underline inline-flex items-center gap-1">
          All tasks <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {open.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400 text-center">No open tasks</p>
      ) : (
        <ul className="divide-y divide-blue-50">
          {open.map((t) => (
            <li key={t.id} className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{t.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {t.assignee_name ? `Assigned to ${t.assignee_name}` : "Assigned to you"}
                {t.due_at && ` · Due ${new Date(t.due_at).toLocaleDateString("en-IN")}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
