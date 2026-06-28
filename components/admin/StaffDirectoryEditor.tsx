"use client";

import { useState, useTransition } from "react";
import type { StaffMember } from "@/lib/content/staff-directory";
import { saveStaffDirectory } from "@/lib/actions/staff-directory";

export function StaffDirectoryEditor({ initial }: { initial: StaffMember[] }) {
  const [items, setItems] = useState<StaffMember[]>(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function updateItem(index: number, field: keyof StaffMember, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value || undefined } : item)),
    );
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      {
        id: `staff-${Date.now()}`,
        name: "",
        designation: "",
        department: "",
      },
    ]);
  }

  function removeRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveStaffDirectory(items.filter((i) => i.name.trim()));
      setMessage(res.ok ? "Staff directory saved." : (res.error ?? "Save failed"));
    });
  }

  return (
    <section className="border-t border-gray-200 pt-10 mt-10">
      <h2 className="text-lg font-semibold text-[#0D2660] mb-2">Staff directory (public)</h2>
      <p className="text-sm text-gray-500 mb-4">
        Shown on <span className="font-medium">/people/staff</span>. Requires content edit permission.
      </p>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl border border-blue-100 bg-gray-50/50">
            <input
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Designation"
              value={item.designation}
              onChange={(e) => updateItem(index, "designation", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Department"
              value={item.department}
              onChange={(e) => updateItem(index, "department", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Phone"
              value={item.phone ?? ""}
              onChange={(e) => updateItem(index, "phone", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Email"
              value={item.email ?? ""}
              onChange={(e) => updateItem(index, "email", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-sm text-red-600 font-medium text-left px-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button type="button" onClick={addRow} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium">
          Add row
        </button>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="px-4 py-2 bg-[#0D2660] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save directory"}
        </button>
      </div>
      {message && <p className="text-sm mt-3 text-gray-600">{message}</p>}
    </section>
  );
}
