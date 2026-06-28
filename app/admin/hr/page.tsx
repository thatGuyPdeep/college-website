import { requirePermission } from "@/lib/auth/helpers";
import { HrPayrollPanel } from "@/components/admin/HrPayrollPanel";
import { StaffDirectoryEditor } from "@/components/admin/StaffDirectoryEditor";
import { listHrLeaveRequests } from "@/lib/actions/faculty-erp";
import { getStaffDirectory } from "@/lib/actions/staff-directory";
import { can } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export default async function AdminHrPage() {
  await requirePermission("recruitment", "view");

  const [leavesResult, staff] = await Promise.all([
    listHrLeaveRequests("pending"),
    getStaffDirectory(),
  ]);
  const pendingLeaves = leavesResult.ok ? leavesResult.data : [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").maybeSingle();
  const role = ((profile as { role?: UserRole } | null)?.role ?? "applicant") as UserRole;
  const canEditStaff = can(role, "content", "edit");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">HR & Payroll</h1>
      <p className="text-sm text-gray-500 mb-8">
        Publish faculty salary slips, manage leave balances, approve leave applications, and edit the public staff directory.
      </p>
      <HrPayrollPanel pendingLeaves={pendingLeaves as Parameters<typeof HrPayrollPanel>[0]["pendingLeaves"]} />
      {canEditStaff && <StaffDirectoryEditor initial={staff} />}
    </div>
  );
}
