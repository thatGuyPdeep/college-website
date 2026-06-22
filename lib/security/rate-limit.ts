import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { checkRateLimitInMemory, type RateLimitResult } from "@/lib/security/rate-limit-memory";

export type { RateLimitResult } from "@/lib/security/rate-limit-memory";
export { checkRateLimitInMemory } from "@/lib/security/rate-limit-memory";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

/**
 * Sliding-window rate limiter. Uses Supabase `rate_limit_events` when available,
 * falls back to in-process memory (single-instance dev).
 */
export async function checkRateLimit(
  bucket: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (process.env.RATE_LIMIT_MEMORY === "true") {
    return checkRateLimitInMemory(bucket, limit, windowMs);
  }

  const now = Date.now();
  const since = new Date(now - windowMs).toISOString();

  try {
    const { data: recent, error } = await admin
      .from("rate_limit_events")
      .select("id")
      .eq("bucket_key", bucket)
      .gte("created_at", since);

    if (!error) {
      if ((recent?.length ?? 0) >= limit) {
        return { allowed: false, retryAfterSec: Math.ceil(windowMs / 1000) };
      }
      await admin.from("rate_limit_events").insert({ bucket_key: bucket });
      return { allowed: true };
    }
  } catch {
    /* fall through to memory */
  }

  return checkRateLimitInMemory(bucket, limit, windowMs);
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function rateLimitResponse(
  bucket: string,
  limit: number,
  windowMs: number
): Promise<Response | null> {
  const result = await checkRateLimit(bucket, limit, windowMs);
  if (result.allowed) return null;
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(result.retryAfterSec ? { "Retry-After": String(result.retryAfterSec) } : {}),
      },
    }
  );
}
