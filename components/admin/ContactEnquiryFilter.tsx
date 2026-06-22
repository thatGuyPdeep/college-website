"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ContactEnquiryFilter() {
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const grievance = params.get("grievance") === "1";

  function hrefFor(next: { status?: string; grievance?: boolean }) {
    const q = new URLSearchParams();
    const nextStatus = "status" in next ? next.status : status;
    const nextGrievance = "grievance" in next ? next.grievance : grievance;
    if (nextStatus) q.set("status", nextStatus);
    if (nextGrievance) q.set("grievance", "1");
    const qs = q.toString();
    return `/admin/contact${qs ? `?${qs}` : ""}`;
  }

  const pills = [
    { label: "All", href: hrefFor({ status: "", grievance: false }), active: !status && !grievance },
    { label: "Unread", href: hrefFor({ status: "new", grievance: false }), active: status === "new" && !grievance },
    { label: "Grievance / Ragging", href: hrefFor({ status: "", grievance: true }), active: grievance },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {pills.map((p) => (
        <Link
          key={p.label}
          href={p.href}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
            p.active
              ? "bg-[#0D2660] text-white border-[#0D2660]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660]"
          }`}
        >
          {p.label}
        </Link>
      ))}
    </div>
  );
}
