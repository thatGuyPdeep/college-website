"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listStaffTasks,
  listAssignableStaff,
  createStaffTask,
  completeStaffTask,
  type StaffTask,
} from "@/lib/actions/admin-tasks";

export function StaffTasksPanel({ canAssign }: { canAssign: boolean }) {
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [staff, setStaff] = useState<{ id: string; full_name: string | null; email: string | null; role: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      const [tasksRes, staffRes] = await Promise.all([
        listStaffTasks(),
        canAssign ? listAssignableStaff() : Promise.resolve({ ok: true as const, data: [] }),
      ]);
      if (tasksRes.ok) setTasks(tasksRes.data);
      if (staffRes.ok) setStaff(staffRes.data);
    });
  }

  useEffect(() => { refresh(); }, [canAssign]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !assignedTo) { toast.error("Title and assignee required"); return; }
    startTransition(async () => {
      const res = await createStaffTask({
        title:       title.trim(),
        assigned_to: assignedTo,
        due_at:      dueAt || undefined,
      });
      if (!res.ok) { toast.error(res.error); return; }
      toast.success("Task assigned");
      setTitle(""); setDueAt(""); setShowForm(false);
      refresh();
    });
  }

  async function handleComplete(id: string) {
    startTransition(async () => {
      const res = await completeStaffTask(id);
      if (!res.ok) { toast.error(res.error); return; }
      toast.success("Task completed");
      refresh();
    });
  }

  const open = tasks.filter((t) => !t.completed_at);
  const done = tasks.filter((t) => t.completed_at);

  return (
    <div className="space-y-6">
      {canAssign && (
        <div>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="bg-[#0D2660] text-white">
              <Plus className="h-4 w-4 mr-1" /> Assign task
            </Button>
          ) : (
            <form onSubmit={handleCreate} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4 max-w-lg">
              <div>
                <Label htmlFor="task-title">Task</Label>
                <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="task-assignee">Assign to</Label>
                <select
                  id="task-assignee"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select staff member…</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name ?? s.email} ({s.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="task-due">Due date (optional)</Label>
                <Input id="task-due" type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={pending} className="bg-[#C8201A] text-white">Create</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      )}

      <section>
        <h2 className="text-sm font-bold text-[#0D2660] mb-3">Open ({open.length})</h2>
        {open.length === 0 ? (
          <p className="text-sm text-gray-400">No open tasks.</p>
        ) : (
          <ul className="space-y-2">
            {open.map((t) => (
              <li key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-blue-100 rounded-xl p-4">
                <div>
                  <p className="font-medium text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    To: {t.assignee_name ?? "Staff"}
                    {t.due_at && ` · Due ${new Date(t.due_at).toLocaleDateString("en-IN")}`}
                  </p>
                </div>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => handleComplete(t.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Mark done
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-3">Completed ({done.length})</h2>
          <ul className="space-y-2 opacity-75">
            {done.slice(0, 10).map((t) => (
              <li key={t.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm line-through text-gray-600">
                {t.title}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
