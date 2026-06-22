import { NextRequest, NextResponse } from "next/server";
import { searchSite } from "@/lib/search/site-index";

export async function GET(req: NextRequest) {
  const q        = req.nextUrl.searchParams.get("q") ?? "";
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  const results  = searchSite(q, category);
  return NextResponse.json({ results });
}
