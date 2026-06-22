export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec?: number;
};

const memoryBuckets = new Map<string, number[]>();

/** In-process sliding window — used as fallback and in tests. */
export function checkRateLimitInMemory(
  bucket: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const hits = (memoryBuckets.get(bucket) ?? []).filter((t) => t > now - windowMs);
  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    return { allowed: false, retryAfterSec: Math.ceil((oldest + windowMs - now) / 1000) };
  }
  hits.push(now);
  memoryBuckets.set(bucket, hits);
  return { allowed: true };
}
