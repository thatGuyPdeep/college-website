import { createHash } from "crypto";

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isInviteExpired(expiresAtIso: string, nowMs = Date.now()): boolean {
  return new Date(expiresAtIso).getTime() < nowMs;
}
