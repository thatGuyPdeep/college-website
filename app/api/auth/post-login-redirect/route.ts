import { NextRequest, NextResponse } from "next/server";
import { resolvePostLoginRedirect } from "@/lib/auth/post-login-redirect";

export async function GET(req: NextRequest) {
  const redirect = req.nextUrl.searchParams.get("redirect");
  const result = await resolvePostLoginRedirect(redirect);
  return NextResponse.json(result);
}
