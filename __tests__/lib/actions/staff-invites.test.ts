import { describe, it, expect } from "vitest";
import {
  INVITE_TTL_MS,
  hashInviteToken,
  isInviteExpired,
} from "@/lib/auth/staff-invite-utils";

describe("staff invites", () => {
  it("INV-01: hashInviteToken is deterministic SHA-256 hex", () => {
    const a = hashInviteToken("test-token-abc");
    const b = hashInviteToken("test-token-abc");
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(hashInviteToken("other")).not.toBe(a);
  });

  it("INV-02: INVITE_TTL_MS is 7 days", () => {
    expect(INVITE_TTL_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("INV-03: isInviteExpired for past and future dates", () => {
    const now = Date.parse("2026-06-01T12:00:00.000Z");
    expect(isInviteExpired("2026-05-01T00:00:00.000Z", now)).toBe(true);
    expect(isInviteExpired("2026-07-01T00:00:00.000Z", now)).toBe(false);
    expect(isInviteExpired("2026-06-01T12:00:00.000Z", now)).toBe(false);
  });
});
