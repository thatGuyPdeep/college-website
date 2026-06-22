"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markEnquiryRead } from "@/lib/actions/admin-contact";
import type { ContactEnquiry } from "@/lib/actions/admin-contact";

export function EnquiryList({ items }: { items: ContactEnquiry[] }) {
  const router = useRouter();

  async function markRead(id: string) {
    const result = await markEnquiryRead(id);
    if (!result.ok) { toast.error(result.error); return; }
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 bg-white border border-blue-100 rounded-xl p-8 text-center">
        No contact enquiries yet. Messages appear here when visitors submit the contact form.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((e) => {
        const isGrievance = /grievance|ragging/i.test(`${e.subject} ${e.message}`);
        return (
        <li key={e.id} className={`bg-white border rounded-xl p-5 ${
          e.status === "new"
            ? isGrievance
              ? "border-[#C8201A] bg-red-50/50"
              : "border-[#C8201A]/30 bg-red-50/30"
            : "border-blue-100"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-gray-900">{e.full_name}</div>
                {isGrievance && (
                  <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-[#C8201A] text-white">
                    Grievance
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{e.email}{e.phone ? ` · ${e.phone}` : ""}</div>
            </div>
            <div className="text-xs text-gray-400">
              {new Date(e.created_at).toLocaleString("en-IN")}
              {e.status === "new" && (
                <Button size="sm" variant="outline" className="ml-2 text-xs" onClick={() => markRead(e.id)}>
                  Mark read
                </Button>
              )}
            </div>
          </div>
          <div className="text-sm font-medium text-[#0D2660] mb-1">{e.subject}</div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{e.message}</p>
        </li>
        );
      })}
    </ul>
  );
}
