import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  FileText,
  Briefcase,
  ClipboardList,
  GraduationCap,
  Bell,
  ListTodo,
  Download,
} from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";
import { roleLabel } from "@/lib/content/staff-roles";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/auth/permissions";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardWelcome({
  role,
  fullName,
  nextApplication,
  unreadNotifications = 0,
  openTasks = 0,
}: {
  role: UserRole;
  fullName?: string | null;
  nextApplication?: { id: string; application_no: string | null } | null;
  unreadNotifications?: number;
  openTasks?: number;
}) {
  const name = fullName?.trim() || "there";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#0D2660]/10 bg-gradient-to-br from-[#0D2660] via-[#0a1f4d] to-[#071540] text-white shadow-lg mb-8">
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" aria-hidden="true" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F5C200]/10 blur-2xl" aria-hidden="true" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#C8201A]/15 blur-2xl" aria-hidden="true" />

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <p className="text-blue-200 text-sm font-medium">{greeting()},</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 truncate">{name}</h1>
            <p className="text-blue-200/90 text-sm mt-2 flex flex-wrap items-center gap-2">
              <span>{roleLabel(role, "en")}</span>
              <span className="text-blue-400">·</span>
              <span className="devanagari text-[#F5C200]">{roleLabel(role, "hi")}</span>
              {unreadNotifications > 0 && (
                <>
                  <span className="text-blue-400">·</span>
                  <span className="inline-flex items-center gap-1 text-amber-200">
                    <Bell className="h-3.5 w-3.5" /> {unreadNotifications} unread
                  </span>
                </>
              )}
              {openTasks > 0 && (
                <>
                  <span className="text-blue-400">·</span>
                  <span className="inline-flex items-center gap-1 text-blue-100">
                    <ListTodo className="h-3.5 w-3.5" /> {openTasks} tasks
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            {can(role, "admissions", "edit") && nextApplication && (
              <Button asChild size="lg" className="bg-[#C8201A] hover:bg-[#9B1812] text-white shadow-md">
                <Link href={`/admin/admissions/${nextApplication.id}`}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Review next
                  {nextApplication.application_no && (
                    <span className="ml-1 opacity-90 font-mono text-xs">({nextApplication.application_no})</span>
                  )}
                </Link>
              </Button>
            )}
            {can(role, "content", "edit") && (
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/admin/content">
                  <FileText className="h-4 w-4 mr-2" />
                  Publish notice
                </Link>
              </Button>
            )}
            {can(role, "examination", "edit") && (
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/admin/examination">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Exam notice
                </Link>
              </Button>
            )}
            {can(role, "recruitment", "edit") && (
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/admin/recruitment">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Recruitment
                </Link>
              </Button>
            )}
            {can(role, "erp", "edit") && role === "faculty" && (
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/admin/erp">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  ERP console
                </Link>
              </Button>
            )}
            {can(role, "compliance", "view") && (
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <a href="/api/admin/reports/executive" download>
                  <Download className="h-4 w-4 mr-2" />
                  Executive report
                </a>
              </Button>
            )}
            <Button asChild size="lg" variant="ghost" className="text-blue-100 hover:text-white hover:bg-white/10">
              <Link href="/admin/notifications">
                Inbox
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
