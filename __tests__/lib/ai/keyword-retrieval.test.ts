import { describe, it, expect } from "vitest";
import { retrieveContextKeyword } from "@/lib/ai/keyword-retrieval";

describe("retrieveContextKeyword", () => {
  it("returns admission-related chunks for apply query", () => {
    const chunks = retrieveContextKeyword("how to apply for admission", 3);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((c) => c.source.includes("admission"))).toBe(true);
  });

  it("returns fallback chunks when no keyword match", () => {
    const chunks = retrieveContextKeyword("xyznonexistentquery123", 3);
    expect(chunks.length).toBeGreaterThan(0);
  });
});

describe("rule-based fee answer", () => {
  it("keyword retrieval finds fee-related content", () => {
    const chunks = retrieveContextKeyword("fee structure payment", 4);
    expect(chunks.length).toBeGreaterThan(0);
  });
});
