"use client";

import { useState, useTransition } from "react";
import { submitLeaveRequest } from "@/lib/actions/faculty-erp";

export function LeaveApplicationForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitLeaveRequest(fd);
      if (res.ok) {
        setMessage({ type: "ok", text: "Leave application submitted for approval." });
        e.currentTarget.reset();
      } else {
        setMessage({ type: "err", text: res.error ?? "Failed to submit" });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
          Leave type
        </label>
        <select
          id="leave_type"
          name="leave_type"
          required
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="casual">Casual Leave</option>
          <option value="earned">Earned Leave</option>
          <option value="medical">Medical Leave</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            id="from_date"
            name="from_date"
            type="date"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="to_date" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            id="to_date"
            name="to_date"
            type="date"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Reason (optional)
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </div>
      {message && (
        <p className={`text-sm ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 bg-[#0D2660] text-white text-sm font-semibold rounded-lg hover:bg-[#071540] disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
