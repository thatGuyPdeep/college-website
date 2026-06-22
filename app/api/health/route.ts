import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** GET /api/health — uptime check for deploy monitors (no auth). */
export async function GET() {
  const checks: Record<string, "ok" | "error" | "skipped"> = {
    supabase: "skipped",
  };

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = adminClient as any;
      const { error } = await db.from("profiles").select("id", { count: "exact", head: true }).limit(1);
      checks.supabase = error ? "error" : "ok";
    }
  } catch {
    checks.supabase = "error";
  }

  const healthy = Object.values(checks).every((v) => v !== "error");

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
