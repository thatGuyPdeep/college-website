import { describe, it, expect } from "vitest";
import { checkRateLimitInMemory } from "@/lib/security/rate-limit-memory";

describe("checkRateLimitInMemory", () => {
  it("allows requests under the limit", () => {
    const bucket = `test-${Date.now()}-${Math.random()}`;
    const r1 = checkRateLimitInMemory(bucket, 3, 60_000);
    const r2 = checkRateLimitInMemory(bucket, 3, 60_000);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  it("blocks when limit exceeded", () => {
    const bucket = `test-block-${Date.now()}-${Math.random()}`;
    checkRateLimitInMemory(bucket, 2, 60_000);
    checkRateLimitInMemory(bucket, 2, 60_000);
    const r3 = checkRateLimitInMemory(bucket, 2, 60_000);
    expect(r3.allowed).toBe(false);
    expect(r3.retryAfterSec).toBeGreaterThan(0);
  });
});
