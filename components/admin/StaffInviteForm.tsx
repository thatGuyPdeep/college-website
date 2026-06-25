"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStaffInvite } from "@/lib/actions/staff-invites";
import type { UserRole } from "@/lib/supabase/types";
import { roleLabel } from "@/lib/content/staff-roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INVITE_ROLES: UserRole[] = [
  "admissions_staff", "examination_staff", "hr_staff", "content_editor",
  "accounts_staff", "iqac_coordinator", "principal", "hod", "faculty", "admin",
];

export function StaffInviteForm({ assignableRoles }: { assignableRoles: UserRole[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(assignableRoles[0] ?? "admissions_staff");
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const roles = INVITE_ROLES.filter((r) => assignableRoles.includes(r));
  if (assignableRoles.includes("super_admin")) roles.push("super_admin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setDevToken(null);
    const result = await createStaffInvite(email, role);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Invitation sent");
    if (result.data?.devToken) setDevToken(result.data.devToken);
    setEmail("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-[#0D2660]">Invite staff member</h3>
      <div>
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="clerk@college.edu"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="invite-role">Role</Label>
        <select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r} value={r}>{roleLabel(r, "en")} — {roleLabel(r, "hi")}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading} className="bg-[#C8201A] hover:bg-[#9B1812]">
        {loading ? "Sending…" : "Send invitation"}
      </Button>
      {devToken && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Dev mode: invite link token <code className="font-mono break-all">{devToken}</code>
        </p>
      )}
    </form>
  );
}
