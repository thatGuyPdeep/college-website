import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, { ring: string; bg: string; text: string; icon: string }> = {
  admissions:  { ring: "ring-blue-200",   bg: "bg-blue-50",   text: "text-blue-800",   icon: "text-blue-600" },
  recruitment: { ring: "ring-purple-200", bg: "bg-purple-50", text: "text-purple-800", icon: "text-purple-600" },
  contact:     { ring: "ring-rose-200",   bg: "bg-rose-50",   text: "text-rose-800",   icon: "text-rose-600" },
  payments:    { ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-800", icon: "text-emerald-600" },
  content:     { ring: "ring-indigo-200", bg: "bg-indigo-50", text: "text-indigo-800", icon: "text-indigo-600" },
  erp:         { ring: "ring-cyan-200",   bg: "bg-cyan-50",   text: "text-cyan-800",   icon: "text-cyan-600" },
  examination: { ring: "ring-amber-200",  bg: "bg-amber-50",  text: "text-amber-900",  icon: "text-amber-700" },
  iqac:        { ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-800", icon: "text-violet-600" },
  compliance:  { ring: "ring-orange-200", bg: "bg-orange-50", text: "text-orange-800", icon: "text-orange-600" },
  default:     { ring: "ring-blue-100",   bg: "bg-slate-50",  text: "text-slate-800",  icon: "text-slate-600" },
};

export function AdminStatCard({
  label,
  value,
  href,
  group,
  icon: Icon,
}: {
  label: string;
  value: string;
  href: string;
  group: string;
  icon: LucideIcon;
}) {
  const a = ACCENT[group] ?? ACCENT.default;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-white/80 bg-white p-5 shadow-sm",
        "ring-1 ring-inset transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        a.ring,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", a.bg)}>
          <Icon className={cn("h-5 w-5", a.icon)} aria-hidden="true" />
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-gray-300 transition-colors group-hover:text-[#C8201A]"
          aria-hidden="true"
        />
      </div>
      <div className="mt-4">
        <p className={cn("text-2xl font-bold tracking-tight tabular-nums", a.text)}>{value}</p>
        <p className="text-sm text-gray-500 mt-1 leading-snug">{label}</p>
      </div>
    </Link>
  );
}
