"use server";

import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/supabase/types";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type AdminSearchResult = {
  type: "application" | "contact" | "faculty_application" | "news";
  title: string;
  subtitle?: string;
  href: string;
};

async function requireSearchAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (profile as any)?.role as UserRole;
  if (!can(role, "dashboard", "view")) throw new Error("Insufficient permissions");
  return { role };
}

export async function adminGlobalSearch(query: string): Promise<ActionResult<AdminSearchResult[]>> {
  try {
    const { role } = await requireSearchAccess();
    const q = query.trim();
    if (q.length < 2) return { ok: true, data: [] };

    const results: AdminSearchResult[] = [];
    const pattern = `%${q}%`;

    if (can(role, "admissions", "view")) {
      const { data } = await admin
        .from("v_applications")
        .select("id, application_no, applicant_name, applicant_email, status")
        .or(`application_no.ilike.${pattern},applicant_name.ilike.${pattern},applicant_email.ilike.${pattern}`)
        .limit(8);
      for (const row of data ?? []) {
        results.push({
          type:     "application",
          title:    `${row.application_no ?? "Draft"} — ${row.applicant_name ?? "Applicant"}`,
          subtitle: String(row.status),
          href:     `/admin/admissions/${row.id}`,
        });
      }
    }

    if (can(role, "contact", "view")) {
      const { data } = await admin
        .from("contact_enquiries")
        .select("id, subject, status, created_at")
        .or(`subject.ilike.${pattern},message.ilike.${pattern}`)
        .limit(6);
      for (const row of data ?? []) {
        results.push({
          type:     "contact",
          title:    row.subject as string,
          subtitle: String(row.status),
          href:     "/admin/contact",
        });
      }
    }

    if (can(role, "recruitment", "view")) {
      const { data } = await admin
        .from("faculty_applications")
        .select("id, status, experience")
        .limit(30);
      for (const row of data ?? []) {
        const exp = row.experience as { full_name?: string; email?: string } | null;
        const name = exp?.full_name ?? "";
        const email = exp?.email ?? "";
        if (!name.toLowerCase().includes(q.toLowerCase()) && !email.toLowerCase().includes(q.toLowerCase())) {
          continue;
        }
        results.push({
          type:     "faculty_application",
          title:    name || "Faculty applicant",
          subtitle: String(row.status),
          href:     "/admin/recruitment",
        });
      }
    }

    if (can(role, "content", "view")) {
      const { data } = await admin
        .from("news_events")
        .select("slug, title, category")
        .ilike("title", pattern)
        .limit(6);
      for (const row of data ?? []) {
        results.push({
          type:     "news",
          title:    row.title as string,
          subtitle: row.category as string | undefined,
          href:     `/admin/content`,
        });
      }
    }

    return { ok: true, data: results.slice(0, 20) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Search failed" };
  }
}
