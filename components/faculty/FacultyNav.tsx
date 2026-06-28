"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/faculty-portal", label: "Overview" },
  { href: "/faculty-portal/attendance", label: "Attendance" },
  { href: "/faculty-portal/salary-slips", label: "Salary Slips" },
  { href: "/faculty-portal/leave", label: "Pay Leave" },
  { href: "/faculty-portal/payroll", label: "Payroll" },
];

export function FacultyNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Faculty portal" className="flex flex-wrap gap-2 mb-8">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
            pathname === l.href
              ? "bg-[#0D2660] text-white border-[#0D2660]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#0D2660]"
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
