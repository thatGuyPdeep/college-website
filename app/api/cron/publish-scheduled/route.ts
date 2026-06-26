import { NextRequest, NextResponse } from "next/server";
import { publishDueScheduledContent } from "@/lib/actions/publish-scheduled";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const token = request.nextUrl.searchParams.get("secret");

  if (secret && auth !== `Bearer ${secret}` && token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await publishDueScheduledContent();
  return NextResponse.json({ ok: true, ...result });
}
