import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

const STAT_KEY = "page_views";
const FALLBACK_COUNT = 12_450;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = adminClient as any;

async function readCount(): Promise<number> {
  try {
    const { data, error } = await db
      .from("site_stats")
      .select("value")
      .eq("key", STAT_KEY)
      .maybeSingle();
    if (error) throw error;
    return typeof data?.value === "number" ? data.value : FALLBACK_COUNT;
  } catch {
    return FALLBACK_COUNT;
  }
}

export async function GET() {
  const count = await readCount();
  return NextResponse.json({ count });
}

export async function POST(req: NextRequest) {
  try {
    const current = await readCount();
    const next = current + 1;

    const { error } = await db
      .from("site_stats")
      .upsert({ key: STAT_KEY, value: next, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ count: next });
  } catch {
    return NextResponse.json({ count: FALLBACK_COUNT });
  }
}
