import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exportExecutiveSummaryCsv } from "@/lib/actions/admin-reports";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!can(role, "compliance", "view") && !can(role, "admissions", "export")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await exportExecutiveSummaryCsv();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  const filename = `executive-summary-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(result.data, {
    headers: {
      "Content-Type":        "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
